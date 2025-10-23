"use server";

import { z } from "zod";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";

export const deleteClaimPatternAction = authAction
  .schema(z.number())
  .action(async ({ parsedInput: id }) => {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/motif/delete/${id}`,
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
