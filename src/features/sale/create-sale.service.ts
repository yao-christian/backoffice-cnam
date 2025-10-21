import {
  InsufficientFundsError,
  NotFoundError,
  UnavailableError,
} from "@/utils/errors";

import { CreateSaleDTO, CreateSaleResponse } from "./sale.type";
import { prisma } from "@/lib/prisma";
import { writeAudit } from "../audit/audit.service";

export async function createSale(
  data: CreateSaleDTO,
): Promise<CreateSaleResponse> {
  // 1) Service
  const service = await prisma.service.findUnique({
    where: { code: data.serviceCode },
  });

  if (!service)
    throw new NotFoundError(`Service ${data.serviceCode} introuvable`);
  if (service.statusCode !== 1)
    throw new UnavailableError(`Service ${data.serviceCode} indisponible`);

  // 2) Vendeur + commission spécifique
  const sellerAccount = await prisma.sellerAccount.findUnique({
    where: { sellerId: data.sellerId },
    include: {
      seller: true,
      commissions: { where: { serviceId: service.id } },
    },
  });

  if (!sellerAccount) throw new NotFoundError(`Vendeur introuvable`);

  const commissionRate =
    sellerAccount.commissions[0]?.commission ?? service.commissionRate ?? 0;

  // 3) Calculs
  const totalAmount =
    service.fee + service.fee * data.serviceQty * (commissionRate / 100);

  if (sellerAccount.balance < totalAmount) {
    throw new InsufficientFundsError(
      `Solde insuffisant. Solde: ${sellerAccount.balance}, Requis: ${totalAmount}`,
    );
  }

  // 4) Transaction
  const balanceAfter = sellerAccount.balance - totalAmount;
  const refTransaction = `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

  const result = await prisma.$transaction(async (tx) => {
    await tx.sellerAccount.update({
      where: { id: sellerAccount.id },
      data: { balance: balanceAfter },
    });

    const createdSale = await tx.sale.create({
      data: {
        refTransaction,
        balanceAfter,
        balanceBefore: sellerAccount.balance,
        quantity: data.serviceQty,
        amount: totalAmount,
        sellerId: sellerAccount.sellerId,
        serviceId: service.id,
      },
    });

    // 🚀 AUDIT (dans la même transaction)
    await writeAudit(tx, {
      userId: data.sellerId,
      entity: "sale",
      entityId: createdSale.id,
      action: "CREATE",
      description: `Vente créée ref=${createdSale.refTransaction} service=${service.code} vendeur=${sellerAccount.sellerCode}`,
      changes: {
        after: {
          quantity: data.serviceQty,
          amount: totalAmount,
          balanceBefore: sellerAccount.balance,
          balanceAfter,
          serviceId: service.id,
          sellerId: sellerAccount.sellerId,
          refTransaction: createdSale.refTransaction,
        },
      },
    });

    return createdSale;
  });

  console.log("Vente réussie:", {
    saleId: result.id,
    refTransaction: result.refTransaction,
    serviceCode: data.serviceCode,
    sellerId: data.sellerId,
    serviceQty: data.serviceQty,
    totalAmount,
    balanceAfter,
    timestamp: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Vente enregistrée avec succès",
    saleId: result.id,
    data: {
      serviceCode: data.serviceCode,
      sellerId: data.sellerId,
      serviceQty: data.serviceQty,
      totalAmount,
      balanceAfter,
    },
  };
}
