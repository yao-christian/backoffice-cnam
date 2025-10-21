"use server";

import { z } from "zod";

import { action } from "@/lib/safe-action";
import { CustomError } from "@/utils/errors";
import { prisma } from "@/lib/prisma";

import { sendPasswordResetOtp } from "@/features/auth/otp.service";

const EmailSchema = z
  .string({ required_error: "Email obligatoire" })
  .min(1, "Email obligatoire")
  .email("Email incorrect");

export const resetPassword = action
  .schema(EmailSchema)
  .action(async ({ parsedInput: email }) => {
    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (!existingUser) {
        throw new CustomError("Cet email n'existe pas!");
      }

      await sendPasswordResetOtp(email);

      return { message: "Email de réinitialisation de mot de passe envoyé!" };
    } catch (error: any) {
      throw new CustomError(
        error?.message || "Erreur lors de l'envoi de l'email",
      );
    }
  });
