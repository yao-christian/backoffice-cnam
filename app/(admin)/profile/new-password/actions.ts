"use server";

import { z } from "zod";
import { CustomError } from "@/utils/errors";

import { prisma } from "@/lib/prisma";

import { action } from "@/lib/safe-action";
import { NewPasswordSchema } from "./schema";
import { bcryptHash } from "@/components/utils/bcrypt";

import {
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/features/auth/otp.service";

export const resetPasswordAction = action
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, otp } }) => {
    try {
      const { email, id } = await verifyPasswordResetOtp(otp);

      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!existingUser) {
        throw new CustomError("Cet email n'existe pas!");
      }

      const hashPassword = await bcryptHash(password);

      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashPassword,
        },
      });

      return { message: "Mot de passe modifié avec succès" };
    } catch (error) {
      throw error;
    }
  });

export const sendNewOtpAction = action
  .schema(z.string().min(1))
  .action(async ({ parsedInput: email }) => {
    try {
      await sendPasswordResetOtp(email);
      return { message: "Email de de réinitialisation de mot passe envoyé!" };
    } catch (error) {
      throw error;
    }
  });
