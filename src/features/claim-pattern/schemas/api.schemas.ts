import { z } from "zod";

export const ClaimPatternApiResponseSchema = z
  .object({
    id: z.number().catch(0),
    libelle: z.string().nullable().optional().catch("—"),
    uuid: z.string().nullable().optional().catch("—"),
    status: z.number().nullable().optional().catch(null),
    created_at: z.string().nullable().optional().catch(null),
    updated_at: z.string().nullable().optional().catch(null),
  })
  .transform((item) => ({
    id: item.id ?? 0,
    label: item.libelle ?? "—",
    uuid: item.libelle ?? "—",
    status: item.status ?? null,
    createdAt: item.created_at ?? null,
    updatedAt: item.updated_at ?? null,
  }))
  .catch({
    id: 0,
    uuid: "—",
    label: "—",
    status: null,
    createdAt: null,
    updatedAt: null,
  });

/** Liste de motifs */
export const ClaimPatternsListSchema = z
  .array(ClaimPatternApiResponseSchema)
  .catch([]);

export const ApiClaimPatternPaginationSchema = z
  .object({
    motifs: z.array(z.any()),
    pagination: z.object({
      current_page: z.number().int().positive(),
      per_page: z.number().int().positive(),
      total: z.number().int().nonnegative(),
      last_page: z.number().int().positive(),
    }),
  })
  .transform((data) => ({
    data: data.motifs,
    currentPage: data.pagination.current_page,
    perPage: data.pagination.per_page,
    total: data.pagination.total,
    lastPage: data.pagination.last_page,
  }));
