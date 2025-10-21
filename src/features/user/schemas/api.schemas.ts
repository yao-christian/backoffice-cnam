import { z } from "zod";

/** Sous-schéma pour les rôles d’un utilisateur */
const UserRoleSchema = z
  .object({
    uuid: z.string().nullable().optional().catch(null),
    name: z.string().nullable().optional().catch("—"),
    description: z.string().nullable().optional().catch(null),
  })
  .transform((item) => ({
    uuid: item.uuid ?? null,
    name: item.name ?? "—",
    description: item.description ?? null,
  }))
  .catch({
    uuid: null,
    name: "—",
    description: null,
  });

/** Schéma principal pour un utilisateur */
export const UserApiResponseSchema = z
  .object({
    id: z.number().catch(0),
    name: z.string().nullable().optional().catch("—"),
    email: z.string().nullable().optional().catch("—"),
    email_verified_at: z.string().nullable().optional().catch(null),
    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
    uuid: z.string().nullable().optional().catch(null),
    first_name: z.string().nullable().optional().catch("—"),
    last_name: z.string().nullable().optional().catch("—"),
    status: z.number().nullable().optional().catch(null),
    role_id: z.number().nullable().optional().catch(null),
    created_user: z.string().nullable().optional().catch(null),
    updated_user: z.string().nullable().optional().catch(null),
    otp: z.string().nullable().optional().catch(null),
    otp_validate: z.string().nullable().optional().catch(null),
    phone: z.string().nullable().optional().catch("—"),
    roles: z.array(UserRoleSchema).nullable().optional().catch([]),
  })
  .transform((item) => ({
    id: item.id ?? 0,
    name: item.name ?? "—",
    email: item.email ?? "—",
    emailVerifiedAt: item.email_verified_at ?? null,
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
    uuid: item.uuid ?? null,
    firstName: item.first_name ?? "—",
    lastName: item.last_name ?? "—",
    status: item.status ?? null,
    roleId: item.role_id ?? null,
    createdUser: item.created_user ?? null,
    updatedUser: item.updated_user ?? null,
    otp: item.otp ?? null,
    otpValidate: item.otp_validate ?? null,
    phone: item.phone ?? "—",
    roles: item.roles ?? [],
  }))
  .catch({
    id: 0,
    name: "—",
    email: "—",
    emailVerifiedAt: null,
    createdAt: null,
    updatedAt: null,
    uuid: null,
    firstName: "—",
    lastName: "—",
    status: null,
    roleId: null,
    createdUser: null,
    updatedUser: null,
    otp: null,
    otpValidate: null,
    phone: "—",
    roles: [],
  });

export const UsersListSchema = z.array(UserApiResponseSchema).catch([]);
