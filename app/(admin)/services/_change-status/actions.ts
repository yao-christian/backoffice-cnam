"use server";

import { z } from "zod";

import { authAction } from "@/lib/safe-action";
import { prisma } from "@/lib/prisma";
import { CustomError } from "@/utils/errors";
// import { AUDIT_ACTIONS } from "@/constants/audits";

export const changeServiceStatusAction = authAction
  .schema(
    z.object({
      id: z.string(),
      newStatus: z.object({ code: z.number(), name: z.string() }),
    }),
  )
  .action(async ({ parsedInput: { id, newStatus } }) => {
    try {
      await prisma.service.update({
        where: { id },
        data: {
          statusCode: newStatus.code,
          statusName: newStatus.name,
        },
      });

      // if (newStatusCode === STATUS_CODES.activated) {
      //   // action log of status
      //   const session = await auth();

      //   await prisma.auditLog.create({
      //     data: {
      //       action: `${AUDIT_ACTIONS.ACTIVITER}_SELLER`,
      //       entity: "Seller",
      //       entityId: id,
      //       changes: `Activation du vendeur : ${seller.user.name}`,
      //       timestamp: new Date(),
      //       userId: Number(session?.user.id),
      //     },
      //   });
      // } else {
      //   //action log of status
      //   const session = await auth();

      //   await prisma.auditLog.create({
      //     data: {
      //       action: `${AUDIT_ACTIONS.DESACTIVER}_SELLER`,
      //       entity: "Seller",
      //       entityId: id,
      //       changes: `Désactivation du vendeur : ${seller.user.name}`,
      //       timestamp: new Date(),
      //       userId: Number(session?.user.id),
      //     },
      //   });
      // }

      return "Opération éffectuée avec succès";
    } catch (error) {
      throw new CustomError(
        "La modification du statut du service a échoué, veuillez réessayer.",
      );
    }
  });
