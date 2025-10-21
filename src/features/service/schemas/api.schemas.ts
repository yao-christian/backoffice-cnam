import { z } from "zod";

/** Réponse paginée brute renvoyée par l’API (champ "data") */
export const ApiServiceItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  api_key: z.string().nullable(),
  api_secret: z.string().nullable(),
  prepaid_service_name: z.string().nullable().optional(),
  created_at: z.string(), // ou z.coerce.date().transform(d => d.toISOString())
  updated_at: z.string(),
  code: z.string().nullable(),
  key: z.string().nullable(),
  identifiant: z.string().nullable(),
  prepaid: z.boolean(),
  uuid: z.string().nullable(),
});

export const ApiPaginationSchema = z.object({
  current_page: z.number().int().positive(), // 1-based côté API
  data: z.array(ApiServiceItemSchema),
  per_page: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  last_page: z.number().int().positive(),
  // autres champs dispo si besoin (links, next_page_url, ...)
});

/** Modèle de domaine (camelCase) : tu t’affranchis de la forme API */
export const ServiceSchema = z.object({
  id: z.number(),
  name: z.string(),
  apiKey: z.string().nullable(),
  prepaidServiceName: z.string().nullable().optional(),
  apiSecret: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  code: z.string().nullable(),
  key: z.string().nullable(),
  identifiant: z.string().nullable(),
  prepaid: z.boolean(),
  uuid: z.string().nullable(),
});

type Service = z.infer<typeof ServiceSchema>;

/** Adaptateur : API -> Domaine */
export function adaptService(
  item: z.infer<typeof ApiServiceItemSchema>,
): Service {
  return {
    id: item.id,
    name: item.name,
    apiKey: item.api_key,
    prepaidServiceName: item.prepaid_service_name,
    apiSecret: item.api_secret,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    code: item.code,
    key: item.key,
    identifiant: item.identifiant,
    prepaid: item.prepaid,
    uuid: item.uuid,
  };
}
