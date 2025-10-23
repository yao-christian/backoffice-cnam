import { z } from "zod";

/** Élément brut renvoyé par l’API -> transformé en modèle de domaine (camelCase) */
export const DuplicataApiResponseSchema = z
  .object({
    id: z.number().nullable().optional().catch(0),
    transaction_id: z.string().nullable().optional().catch(null),
    secu_number: z.string().nullable().optional().catch(null),
    msisdn: z.string().nullable().optional().catch(null),
    payment_ref: z.string().nullable().optional().catch(null),

    // montant accepté comme string ou number
    amount: z.coerce.number().nullable().optional().catch(0),

    // normalisation booléenne plus souple
    payment_status: z
      .union([z.boolean(), z.number(), z.string()])
      .optional()
      .catch(false),
    delivered: z
      .union([z.boolean(), z.number(), z.string()])
      .optional()
      .catch(false),
    cnam_notified: z
      .union([z.boolean(), z.number(), z.string()])
      .optional()
      .catch(false),

    wallet_id: z.string().nullable().optional().catch(null),
    wallet_name: z.string().nullable().optional().catch(null),
    subscriber_type: z.string().nullable().optional().catch(null),
    gateway_order_id: z.string().nullable().optional().catch(null),

    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
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
      transactionId: item.transaction_id ?? null,
      secuNumber: item.secu_number ?? null,
      msisdn: item.msisdn ?? null,
      paymentRef: item.payment_ref ?? null,
      amount: item.amount ?? 0,
      paymentStatus: toBool(item.payment_status),
      delivered: toBool(item.delivered),
      cnamNotified: toBool(item.cnam_notified),
      walletId: item.wallet_id ?? null,
      walletName: item.wallet_name ?? null,
      subscriberType: item.subscriber_type ?? null,
      gatewayOrderId: item.gateway_order_id ?? null,
      createdAt: item.created_at ?? null,
      updatedAt: item.updated_at ?? null,
    };
  })
  .catch({
    id: 0,
    transactionId: null,
    secuNumber: null,
    msisdn: null,
    paymentRef: null,
    amount: 0,
    paymentStatus: false,
    delivered: false,
    cnamNotified: false,
    walletId: null,
    walletName: null,
    subscriberType: null,
    gatewayOrderId: null,
    createdAt: null,
    updatedAt: null,
  });

/** Liste de duplicatas */
export const DuplicataListSchema = z
  .array(DuplicataApiResponseSchema)
  .catch([]);
