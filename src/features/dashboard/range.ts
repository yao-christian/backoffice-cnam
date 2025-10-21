import { z } from "zod";

export const RangeSchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export function resolveRange(
  input?: Partial<{ from?: Date | string; to?: Date | string }>,
) {
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const parsed = RangeSchema.safeParse(input ?? {});
  const from =
    parsed.success && parsed.data.from ? parsed.data.from : firstOfMonth;
  const to = parsed.success && parsed.data.to ? parsed.data.to : now;
  return { from, to } as const;
}
