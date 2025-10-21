"use server";

import { authAction } from "@/lib/safe-action";
import { UpdateProfileFormSchema, UpdateProfileFormType } from "./schema";
import { prisma } from "@/lib/prisma";
import { CustomError } from "@/utils/errors";

export async function updateProfile(
  prismaClient: typeof prisma,
  value: UpdateProfileFormType,
) {
  await prismaClient.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: value.id },
      data: {
        lastName: value.lastName,
        firstName: value.firstName,
        email: value.email,
        phoneNumber: value.phoneNumber,
      },
    });
  });

  return "Modification éffectuée avec succès.";
}

export const updateProfileAction = authAction
  .schema(UpdateProfileFormSchema)
  .action(async ({ parsedInput: value }) => {
    try {
      return await updateProfile(prisma, value);
    } catch (error) {
      if (error instanceof CustomError) {
        throw new CustomError(error.message);
      }

      throw new CustomError("Erreur modification vendeur !");
    }
  });
