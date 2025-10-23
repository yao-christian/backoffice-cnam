import { z } from "zod";

export const RoleSchema = z
  .object({
    uuid: z.string().nullable().optional().catch(null),
    libelle: z.string().nullable().optional().catch("—"),
    description: z.string().nullable().optional().catch(null),
    status: z.number().nullable().optional().catch(null),
  })
  .transform((role) => ({
    uuid: role.uuid ?? null,
    label: role.libelle ?? "—",
    description: role.description ?? null,
    status: role.status ?? null,
  }))
  .catch({
    uuid: null,
    label: "—",
    description: null,
    status: null,
  });

export const PermissionsSchema = z
  .record(z.boolean()) // clé dynamique -> booléen
  .catch({}) // en cas d’erreur, renvoie un objet vide
  .transform((perm) => {
    return perm;
  });

export const RoleDetailsApiResponseSchema = z
  .object({
    role: RoleSchema,
    perm: PermissionsSchema,
  })
  .catch({
    role: {
      uuid: null,
      label: "—",
      description: null,
      status: null,
    },
    perm: {},
  });
