import { FileSchema } from "@/components/utils/schemas/file.schema";
import { z } from "zod";

export const CreateDepositFormSchema = z.object({
  bankId: z.string().trim().min(1, { message: "Champ obligatoire" }),
  amount: z.string().min(1, { message: "Champ obligatoire" }),
  slipNumber: z.string().trim().min(1, { message: "Champ obligatoire" }),
  sellerId: z.string().trim().min(1, { message: "Champ obligatoire" }),
  slipFile: FileSchema,
  depositDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Date invalide",
    })
    .refine((date) => new Date(date) <= new Date(), {
      message: "La date du depôt ne peut pas être dans le futur.",
    }),
});

export type CreateDepositFormInputType = z.input<
  typeof CreateDepositFormSchema
>;

export type CreateDepositFormOutputType = z.output<
  typeof CreateDepositFormSchema
>;
