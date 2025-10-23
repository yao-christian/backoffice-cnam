"use server";

import { z } from "zod";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";

export const deleteUserAction = authAction
  .schema(z.string())
  .action(async ({ parsedInput: uuid }) => {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/delete/${uuid}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          isAuth: true,
        },
      );

      if (!res.ok) {
        throw HttpError.fromResponse(res);
      }

      return "Opération éffectuée avec succès";
    } catch (e) {
      console.error("Create role error:", e);

      throw e;
    }
  });
