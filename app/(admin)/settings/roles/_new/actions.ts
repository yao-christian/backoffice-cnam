"use server";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";
import { CreateRoleSchema } from "@/features/roles/schemas/role.schemas";

export const createRoleAction = authAction
  .schema(CreateRoleSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/role/register`,
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
      console.error("Create role error:", e);

      throw e;
    }
  });
