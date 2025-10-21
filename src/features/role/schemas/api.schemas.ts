import { z } from "zod";

export const RoleApiResponseSchema = z
  .object({
    id: z.number().catch(0),
    name: z.string().nullable().optional().catch("—"),
    guard_name: z.string().nullable().optional().catch(null),
    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
    status: z.number().nullable().optional().catch(null),
    uuid: z.string().nullable().optional().catch(null),
    description: z.string().nullable().optional().catch(null),
    client_id: z.string().nullable().optional().catch(null),
    created_user: z.string().nullable().optional().catch(null),
    updated_user: z.string().nullable().optional().catch(null),
  })
  .transform((item) => {
    return {
      id: item.id ?? 0,
      name: item.name ?? "—",
      guardName: item.guard_name ?? null,
      createdAt: item.created_at ?? null,
      updatedAt: item.updated_at ?? null,
      status: item.status ?? null,
      uuid: item.uuid ?? null,
      description: item.description ?? null,
      clientId: item.client_id ?? null,
      createdUser: item.created_user ?? null,
      updatedUser: item.updated_user ?? null,
    };
  })
  .catch({
    id: 0,
    name: "—",
    guardName: null,
    createdAt: null,
    updatedAt: null,
    status: null,
    uuid: null,
    description: null,
    clientId: null,
    createdUser: null,
    updatedUser: null,
  });

export const RolesListSchema = z.array(RoleApiResponseSchema).catch([]);
