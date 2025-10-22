"use server";

import { action } from "@/lib/safe-action";
import { ResetPasswordSchema } from "./schema";

import { sendPasswordResetOtp } from "@/features/auth/otp.service";

export const resetPassword = action
  .schema(ResetPasswordSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      await sendPasswordResetOtp(email);

      return { message: "Email de de réinitialisation de mot passe envoyé!" };
    } catch (e) {
      console.error("update service error:", e);
      throw e;
    }
  });
