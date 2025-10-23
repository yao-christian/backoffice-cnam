import { z } from "zod";
import { PaymentNotificationApiResponseSchema } from "./schemas/api.schemas";

export type PaymentNotification = z.infer<
  typeof PaymentNotificationApiResponseSchema
>;
