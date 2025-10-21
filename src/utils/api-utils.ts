import { z } from "zod";

export const ApiPaginationSchema = z
  .object({
    current_page: z.number().int().positive(), // 1-based côté API
    data: z.array(z.any()),
    per_page: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    last_page: z.number().int().positive(),
  })
  .transform((data) => ({
    currentPage: data.current_page,
    data: data.data,
    perPage: data.per_page,
    total: data.total,
    lastPage: data.last_page,
  }));
