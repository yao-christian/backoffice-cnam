import { z } from "zod";

export const CreateSaleSchema = z.object({
  serviceCode: z.string().min(1, "serviceCode requis"),
  serviceQty: z.number().int().positive("serviceQty doit être > 0"),
});

export type CreateSaleDTO = z.infer<typeof CreateSaleSchema>;
