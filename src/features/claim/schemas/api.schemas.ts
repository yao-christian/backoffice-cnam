import { z } from "zod";

export const ClaimPatternSchema = z
  .object({
    id: z.number().catch(0),
    libelle: z.string().nullable().optional().catch("—"),
    status: z.number().nullable().optional().catch(null),
    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
  })
  .transform((item) => ({
    id: item.id ?? 0,
    libelle: item.libelle ?? "—",
    status: item.status ?? null,
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
  }))
  .catch({
    id: 0,
    libelle: "—",
    status: null,
    createdAt: null,
    updatedAt: null,
  });

/** Sous-schéma : Plateforme d’origine de la réclamation */
export const ClaimPlatformSchema = z
  .object({
    id: z.number().catch(0),
    name: z.string().nullable().optional().catch("—"),
    api_key: z.string().nullable().optional().catch("—"),
    api_secret: z.string().nullable().optional().catch("—"),
    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
    code: z.string().nullable().optional().catch("—"),
    key: z.string().nullable().optional().catch(null),
    identifiant: z.string().nullable().optional().catch(null),
    prepaid: z.boolean().nullable().optional().catch(false),
    uuid: z.string().nullable().optional().catch(null),
    statut: z.boolean().nullable().optional().catch(null),
  })
  .transform((item) => ({
    id: item.id ?? 0,
    name: item.name ?? "—",
    apiKey: item.api_key ?? "—",
    apiSecret: item.api_secret ?? "—",
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
    code: item.code ?? "—",
    key: item.key ?? null,
    identifiant: item.identifiant ?? null,
    prepaid: item.prepaid ?? false,
    uuid: item.uuid ?? null,
    statut: item.statut ?? null,
  }))
  .catch({
    id: 0,
    name: "—",
    apiKey: "—",
    apiSecret: "—",
    createdAt: null,
    updatedAt: null,
    code: "—",
    key: null,
    identifiant: null,
    prepaid: false,
    uuid: null,
    statut: null,
  });

/** Schéma principal : Réclamation (Claim) */
export const ClaimApiResponseSchema = z
  .object({
    id: z.number().catch(0),
    reference: z.string().nullable().optional().catch("—"),
    number: z.string().nullable().optional().catch("—"),
    email: z.string().nullable().optional().catch("—"),
    comment: z.string().nullable().optional().catch(null),
    status_at: z.string().nullable().optional().catch(null),
    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
    status_id: z.number().nullable().optional().catch(null),
    pattern_id: z.number().nullable().optional().catch(null),
    platform_id: z.number().nullable().optional().catch(null),
    status_label: z.string().nullable().optional().catch("—"),
    pattern: ClaimPatternSchema.nullable().optional().catch(null),
    platform: ClaimPlatformSchema.nullable().optional().catch(null),
  })
  .transform((item) => ({
    id: item.id ?? 0,
    reference: item.reference ?? "—",
    number: item.number ?? "—",
    email: item.email ?? "—",
    comment: item.comment ?? null,
    statusAt: item.status_at ?? null,
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
    statusId: item.status_id ?? null,
    patternId: item.pattern_id ?? null,
    platformId: item.platform_id ?? null,
    statusLabel: item.status_label ?? "—",
    pattern: item.pattern ?? null,
    platform: item.platform ?? null,
  }))
  .catch({
    id: 0,
    reference: "—",
    number: "—",
    email: "—",
    comment: null,
    statusAt: null,
    createdAt: null,
    updatedAt: null,
    statusId: null,
    patternId: null,
    platformId: null,
    statusLabel: "—",
    pattern: null,
    platform: null,
  });

export const ApiClaimPaginationSchema = z
  .object({
    claims: z.array(z.any()),
    pagination: z.object({
      current_page: z.number().int().positive(),
      per_page: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      last_page: z.number().int().positive(),
    }),
  })
  .transform((data) => ({
    data: data.claims,
    currentPage: data.pagination.current_page,
    perPage: data.pagination.per_page,
    total: data.pagination.total,
    lastPage: data.pagination.last_page,
  }));

/** Liste de réclamations */
export const ClaimsListSchema = z.array(ClaimApiResponseSchema).catch([]);
