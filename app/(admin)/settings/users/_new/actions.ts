"use server";

import { authAction } from "@/lib/safe-action";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";
import { CreateUserSchema } from "@/features/user/schemas/role.schemas";

export const createUserAction = authAction
  .schema(CreateUserSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const payload = {
        last_name: values.lastName,
        first_name: values.firstName,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
        status: values.status,
        phone: values.phone,
        email: values.email,
        role_id: values.roleId,
      };

      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          isAuth: true,
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        throw HttpError.fromResponse(res);
      }

      return "Opération éffectuée avec succès";
    } catch (e) {
      console.error("Create user error:", e);

      throw e;
    }
  });
