import { z } from "zod";

/** Item brut renvoyé par l’API */
export const ApiPaymentNotificationItemSchema = z.object({
  id: z.number().int(),
  order_id: z.string(),
  msisdn: z.string().nullable(),
  amount: z.number(), // si l’API renvoie string, fais z.coerce.number()
  momo_id: z.string(),
  service_id: z.number().nullable(),
  service_name: z.string().nullable(),
  delivered: z.boolean(),
  payment_status: z.boolean(),
  created_at: z.string(), // "YYYY-MM-DD HH:mm:ss.SSSSSS"
  updated_at: z.string(),
});

/** Pagination brute renvoyée par l’API (champ "data") */
export const ApiPaginationSchema = z.object({
  current_page: z.number().int().positive(), // 1-based
  data: z.array(ApiPaymentNotificationItemSchema),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  last_page: z.number().int().positive(),
});

/** Modèle de domaine (camelCase) ; on s’affranchit de la forme API */
export const PaymentNotificationSchema = z.object({
  id: z.number().int(),
  orderId: z.string(),
  msisdn: z.string().nullable(),
  amount: z.number(),
  momoId: z.string(),
  serviceId: z.number().nullable(),
  serviceName: z.string().nullable(),
  delivered: z.boolean(),
  paymentStatus: z.boolean(),
  createdAt: z.string(), // tu peux transformer en ISO si tu veux
  updatedAt: z.string(),
});

type PaymentNotification = z.infer<typeof PaymentNotificationSchema>;

/** Adaptateur : API -> Domaine */
export function adaptPaymentNotification(
  item: z.infer<typeof ApiPaymentNotificationItemSchema>,
): PaymentNotification {
  return {
    id: item.id,
    orderId: item.order_id,
    msisdn: item.msisdn,
    amount: item.amount,
    momoId: item.momo_id,
    serviceId: item.service_id,
    serviceName: item.service_name,
    delivered: item.delivered,
    paymentStatus: item.payment_status,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}
