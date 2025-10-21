"use server";

import { z } from "zod";

import { action } from "@/lib/safe-action";

import {
  sendVerifivationEmailOtp,
  verifyVerificationEmailOtp,
} from "@/features/auth/otp.service";

export const verifyOtpAction = action
  .schema(z.string().min(1))
  .action(async ({ parsedInput: otp }) => {
    try {
      await verifyVerificationEmailOtp(otp);
      return { message: "Vérification email éffectuée avec succès" };
    } catch (error) {
      throw error;
    }
  });

export const sendNewOtpAction = action
  .schema(z.string())
  .action(async ({ parsedInput: email }) => {
    try {
      await sendVerifivationEmailOtp(email);
      return { message: "Un nouveau code OTP a été envoyé." };
    } catch (error) {
      throw error;
    }
  });
