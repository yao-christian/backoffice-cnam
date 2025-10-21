import { z } from "zod";

export const FileSchema = z
  .custom<FileList | undefined>()
  .transform((val) => {
    if (val instanceof File) return val;
    if (val instanceof FileList) return val[0];
    return null;
  })
  .superRefine((file, ctx) => {
    if (!(file instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Un fichier valide est requis",
      });
      return z.NEVER;
    }

    if (file.size > 5 * 1024 * 1024) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La taille du fichier doit être inférieure à 5MB.",
      });
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Pour les documents Word modernes (.docx)
      ].includes(file.type)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Seuls les fichiers JPG, PNG, pdf et world sont autorisés.",
      });
    }
  })
  .pipe(z.custom<File>());
