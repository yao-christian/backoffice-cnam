"use server";

import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { FileStorageProxy } from "@/file-storage/file-storage-proxy";
import { getFileExtension } from "@/file-storage";
import { writeAudit } from "@/features/audit/audit.service";
import { USER_ROLES } from "@/features/user/user.constant";
import { getAuthSession } from "@/lib/auth/auth-session";

function parseAdminDepositForm(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const slipNumber = String(formData.get("slipNumber") || "");
  const bankId = String(formData.get("bankId") || "");
  const sellerId = String(formData.get("sellerId") || ""); // <-- ADMIN cible un vendeur par son code
  const file = formData.get("slipFile") as File | null;

  if (!file) throw new Error("Aucun fichier n'a été fourni !");
  if (!slipNumber) throw new Error("Numéro de bordereau requis");
  if (!bankId) throw new Error("Banque requise");
  if (!sellerId) throw new Error("Code vendeur requis");
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Montant invalide");

  return { amount, slipNumber, bankId, sellerId, file };
}

export const createDepositAction = async (formData: FormData) => {
  const fileStorageProxy = new FileStorageProxy();

  const session = await getAuthSession();

  const isAuthenticated = !!session?.user;

  if (!isAuthenticated) {
    redirect("/deposits");
  }

  const role = (session.user as any)?.role?.code as string | undefined;

  if (
    !role ||
    ![USER_ROLES.admin.code, USER_ROLES.superAdmin.code].includes(role)
  ) {
    throw new Error("Accès refusé : administrateur uniquement");
  }

  const { amount, slipNumber, bankId, sellerId, file } =
    parseAdminDepositForm(formData);

  // Résoudre le vendeur ciblé par son code (sécurité : ne pas faire confiance à un sellerId client)
  const sellerAccount = await prisma.sellerAccount.findUnique({
    where: { sellerId },
    include: { seller: true },
  });
  if (!sellerAccount) throw new Error(`Compte vendeur introuvable`);

  // Idempotence métier : slipNumber est unique
  const duplicate = await prisma.sellerDeposit
    .findUnique({ where: { slipNumber } })
    .catch(() => null);
  if (duplicate) throw new Error("Ce numéro de bordereau existe déjà");

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    return await prisma.$transaction(async (tx) => {
      const beforeBalance = sellerAccount.balance;

      // 1) Créditer le compte vendeur
      const updatedAccount = await tx.sellerAccount.update({
        where: { id: sellerAccount.id },
        data: { balance: { increment: amount } },
      });

      const createdDeposit = await tx.sellerDeposit.create({
        data: {
          amount,
          slipNumber,
          bankId,
          amountBefore: beforeBalance,
          depositDate: new Date(),
          sellerAccountId: sellerAccount.id,
        },
      });

      const fileExtension = getFileExtension(file.name);
      const fileName = `${slipNumber}.${fileExtension}`;

      const url = await fileStorageProxy.uploadFile(buffer, fileName);

      const finalDeposit = await tx.sellerDeposit.update({
        where: { id: createdDeposit.id },
        data: { slipFileName: fileName, slipFileUrl: url },
      });

      // 4) AUDIT — même transaction (bloquant = cohérence)
      await writeAudit(tx, {
        userId: session.user.id,
        entity: "seller_account",
        entityId: sellerAccount.id,
        action: "UPDATE",
        description: `Crédit de ${amount} XOF par dépôt #${slipNumber} (admin) pour vendeur ${sellerAccount.seller.lastName}`,
        changes: {
          before: { balance: beforeBalance },
          after: { balance: updatedAccount.balance },
        },
      });

      await writeAudit(tx, {
        userId: session.user.id,
        entity: "seller_deposit",
        entityId: finalDeposit.id,
        action: "CREATE",
        description: `Dépôt #${slipNumber} créé (banque=${bankId}) pour vendeur ${sellerAccount.seller.lastName} (admin)`,
        changes: {
          after: {
            amount,
            amountBefore: beforeBalance,
            slipNumber,
            bankId,
            slipFileName: fileName,
            slipFileUrl: url,
            sellerAccountId: sellerAccount.id,
          },
        },
      });
    });
  } catch (error: any) {
    console.error("Create deposit error", error.message);
    throw Error("Erreur lors de la création d'un deposit");
  }
};
