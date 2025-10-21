import { z } from "zod";
import { PaymentNotificationSchema } from "./schemas/api.schemas";

export type PaymentNotification = z.infer<typeof PaymentNotificationSchema>;
