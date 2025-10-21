"use server";

import { authAction } from "@/lib/safe-action";
import { CreateServiceFormSchema } from "./schema";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";

export const createServiceAction = authAction
  .schema(CreateServiceFormSchema)
  .action(async ({ parsedInput: values }) => {
    try {
      const payload = values.prepaid
        ? {
            name: values.name,
            prepaye: true,
            prepaid_service_name: values.prepaidServiceName,
            key: values.apiKey,
            identifiant: values.apiSecret,
          }
        : {
            name: values.name,
            prepaid: false,
          };

      const res = await customFetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? ""}/api/service/register`,
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
      console.error("Create service error:", e);

      throw e;
    }
  });
