"use server";

import { action } from "@/lib/safe-action";
import { ResetPasswordSchema } from "./schema";
import { CustomError } from "@/utils/errors";
import { prisma } from "@/lib/prisma";

import { sendPasswordResetOtp } from "@/features/auth/otp.service";

export const resetPassword = action
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        throw new CustomError("Cet email n'existe pas!");
      }

      await sendPasswordResetOtp(email);

      return { message: "Email de de réinitialisation de mot passe envoyé!" };
    } catch (error) {
      throw error;
    }
  });
