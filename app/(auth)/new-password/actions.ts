"use server";

import { z } from "zod";

import { action } from "@/lib/safe-action";
import { NewPasswordSchema } from "./schema";

import {
  initPasswordByOtp,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
} from "@/features/auth/otp.service";

import { BaseError, HttpError } from "@/utils/errors";

export const resetPasswordAction = action
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput }) => {
    const { email, otp, password, confirmPassword } = parsedInput;

    try {
      // 1) Vérifier le code OTP
      await verifyPasswordResetOtp(email, otp);

      // 2) Initialiser / réinitialiser le mot de passe
      await initPasswordByOtp({
        email,
        otp,
        password,
        passwordConfirmation: confirmPassword,
      });

      return {
        ok: true as const,
        message: "Mot de passe modifié avec succès.",
      };
    } catch (err) {
      // Normalisation d’erreur (tu peux aussi laisser l’exception remonter si safe-action gère)
      if (err instanceof HttpError) {
        return {
          ok: false as const,
          message: err.message,
          status: err.statusCode,
          kind: err.kind,
        };
      }
      if (err instanceof BaseError) {
        return {
          ok: false as const,
          message: err.message,
          status: err.statusCode ?? 500,
          kind: err.kind,
        };
      }
      return {
        ok: false as const,
        message:
          "Erreur inattendue lors de la réinitialisation du mot de passe.",
      };
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
