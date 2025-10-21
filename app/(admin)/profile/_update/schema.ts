import { z } from "zod";

const ivorianPhoneNumberSchema = z.string().refine(
  (value) => {
    const phoneNumberRegex = /^[0-9]{10}$/;
    const cleanedValue = value ? value.replace(/[ -()]/g, "") : value;

    return phoneNumberRegex.test(cleanedValue);
  },
  {
    message: "Numéro de téléphone incorrect !",
  },
);

export const UpdateProfileFormSchema = z.object({
  id: z.string().min(1, { message: "Champ obligatoire" }),
  lastName: z.string().trim().min(1, { message: "Champ obligatoire" }),
  firstName: z.string().optional(),
  email: z.string().trim().min(1, { message: "Champ obligatoire" }),
  phoneNumber: ivorianPhoneNumberSchema,
});

export type UpdateProfileFormTypeInput = z.input<
  typeof UpdateProfileFormSchema
>;

export type UpdateProfileFormType = z.output<typeof UpdateProfileFormSchema>;
