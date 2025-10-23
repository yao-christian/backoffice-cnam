import { z } from "zod";

/** Élément brut renvoyé par l’API -> transformé en modèle de domaine (camelCase) */
export const PaymentNotificationApiResponseSchema = z
  .object({
    id: z.number().catch(0),
    order_id: z.string().nullable().optional().catch(""),
    msisdn: z.string().nullable().optional().catch(null),

    // L’API peut renvoyer un nombre ou une string → on force vers number
    amount: z.coerce.number().catch(0),

    momo_id: z.string().nullable().optional().catch(""),
    service_id: z.number().nullable().optional().catch(null),
    service_name: z.string().nullable().optional().catch(null),

    // Si jamais l’API renvoie 0/1, on normalise en bool dans le transform
    delivered: z
      .union([z.boolean(), z.number(), z.string()])
      .optional()
      .catch(false),
    payment_status: z
      .union([z.boolean(), z.number(), z.string()])
      .optional()
      .catch(false),

    created_at: z.string().nullable().optional().catch(""),
    updated_at: z.string().nullable().optional().catch(""),
  })
  .transform((item) => {
    const toBool = (v: unknown): boolean => {
      if (typeof v === "boolean") return v;
      if (typeof v === "number") return v === 1;
      if (typeof v === "string") return v === "1" || v.toLowerCase() === "true";
      return false;
    };

    return {
      id: item.id ?? 0,
      orderId: item.order_id ?? "",
      msisdn: item.msisdn ?? null,
      amount: item.amount ?? 0,
      momoId: item.momo_id ?? "",
      serviceId: item.service_id ?? null,
      serviceName: item.service_name ?? null,
      delivered: toBool(item.delivered),
      paymentStatus: toBool(item.payment_status),
      // Tu peux convertir en ISO ici si besoin (ex: new Date(item.created_at!).toISOString())
      createdAt: item.created_at ?? "",
      updatedAt: item.updated_at ?? "",
    };
  })
  .catch({
    id: 0,
    orderId: "",
    msisdn: null,
    amount: 0,
    momoId: "",
    serviceId: null,
    serviceName: null,
    delivered: false,
    paymentStatus: false,
    createdAt: "",
    updatedAt: "",
  });

/** Liste simple */
export const PaymentNotificationsListSchema = z
  .array(PaymentNotificationApiResponseSchema)
  .catch([]);
