"use server";

import { z } from "zod";

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
