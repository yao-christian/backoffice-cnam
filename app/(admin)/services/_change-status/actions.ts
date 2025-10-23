"use server";

import { z } from "zod";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";

export const changeServiceStatusAction = authAction
  .schema(z.object({ uuid: z.string(), status: z.boolean() }))
  .action(async ({ parsedInput: { uuid, status } }) => {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/service/update/${uuid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          isAuth: true,
          body: JSON.stringify({
            statut: status,
          }),
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
