"use server";

import { authAction } from "@/lib/safe-action";
import { UpdateServiceFormSchema } from "./schema";
import { HttpError } from "@/utils/errors";
import { customFetch } from "@/components/utils/custom-fetch";

export const updateServiceAction = authAction
  .schema(UpdateServiceFormSchema)
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/service/update/${values.uuid}`,
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
      console.error("update service error:", e);
      throw e;
    }
  });
