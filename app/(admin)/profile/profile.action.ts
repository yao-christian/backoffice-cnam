"use server";

import { z } from "zod";

import { action } from "@/lib/safe-action";

const EmailSchema = z
  .string({ required_error: "Email obligatoire" })
  .min(1, "Email obligatoire")
  .email("Email incorrect");

export const resetPassword = action
  .schema(EmailSchema)
  .action(async ({ parsedInput: email }) => {
    try {
      return { message: "Email de réinitialisation de mot de passe envoyé!" };
    } catch (e) {}
  });
