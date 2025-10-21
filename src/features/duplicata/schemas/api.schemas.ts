import { z } from "zod";

export const ApiDuplicataItemSchema = z.object({
  id: z.number().int().nullable(),
  transaction_id: z.string().nullable(),
  secu_number: z.string().nullable(),
  msisdn: z.string().nullable().nullable(),
  payment_ref: z.string().nullable(),
  amount: z.number().nullable(),
  payment_status: z.boolean().nullable(),
  delivered: z.boolean().nullable(),
  wallet_id: z.string().nullable(),
  wallet_name: z.string().nullable(),
  cnam_notified: z.boolean().nullable(),
  subscriber_type: z.string().nullable(),
  gateway_order_id: z.string().nullable(),
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

/** Pagination brute renvoyée par l’API (champ "data") */
export const ApiPaginationSchema = z.object({
  current_page: z.number().int().positive(), // 1-based
  data: z.array(ApiDuplicataItemSchema),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  last_page: z.number().int().positive(),
});

/** Modèle de domaine (camelCase) */
export const DuplicataSchema = z.object({
  id: z.number().int().nullable(),
  transactionId: z.string().nullable(),
  secuNumber: z.string().nullable(),
  msisdn: z.string().nullable(),
  paymentRef: z.string().nullable(),
  amount: z.number().nullable(),
  paymentStatus: z.boolean().nullable(),
  delivered: z.boolean().nullable(),
  walletId: z.string().nullable(),
  walletName: z.string().nullable(),
  cnamNotified: z.boolean().nullable(),
  subscriberType: z.string().nullable(),
  gatewayOrderId: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
});

type Duplicata = z.infer<typeof DuplicataSchema>;

export function adaptDuplicata(
  item: z.infer<typeof ApiDuplicataItemSchema>,
): Duplicata {
  return {
    id: item.id,
    transactionId: item.transaction_id,
    secuNumber: item.secu_number,
    msisdn: item.msisdn,
    paymentRef: item.payment_ref,
    amount: item.amount,
    paymentStatus: item.payment_status,
    delivered: item.delivered,
    walletId: item.wallet_id,
    walletName: item.wallet_name,
    cnamNotified: item.cnam_notified,
    subscriberType: item.subscriber_type,
    gatewayOrderId: item.gateway_order_id,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
