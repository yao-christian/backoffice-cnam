"use server";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";
import { UpdateClaimSchema } from "@/features/claim/schemas/claim.schema";

export const updateClaimAction = authAction
  .schema(UpdateClaimSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const payload = {
        ...values,
        status_id: values.status,
      };
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/claim/update/${values.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          isAuth: true,
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        throw HttpError.fromResponse(res);
      }

      return "Modification éffectuée avec succès.";
    } catch (e) {
      console.error("update role error:", e);
      throw e;
    }
  });
