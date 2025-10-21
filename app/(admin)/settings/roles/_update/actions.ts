"use server";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";
import { UpdateRoleSchema } from "@/features/roles/schemas/role.schemas";

export const updateServiceAction = authAction
  .schema(UpdateRoleSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const payload = {
        ...values,
        status: values.status ? 1 : 0,
      };
      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/role/update/${values.uuid}`,
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
