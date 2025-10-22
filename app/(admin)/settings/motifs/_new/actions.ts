"use server";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";
import { CreateClaimPatternSchema } from "@/features/claim-pattern/schemas/claim-pattern.schema";

export const createClaimPatternAction = authAction
  .schema(CreateClaimPatternSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/motif/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          isAuth: true,
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) {
        throw HttpError.fromResponse(res);
      }

      return "Opération éffectuée avec succès";
    } catch (e) {
      console.error("Create ClaimPattern error:", e);

      throw e;
    }
  });
