"use server";

import { authAction } from "@/lib/safe-action";
import { UpdateProfileFormSchema, UpdateProfileFormType } from "./schema";

export const updateProfileAction = authAction
  .schema(UpdateProfileFormSchema)
  .action(async ({ parsedInput: value }) => {
    try {
    } catch (error) {
      throw error;
    }
  });
