import { NextResponse } from "next/server";
import { z } from "zod";

export function jsonError(
  message: string,
  status: number,
  extra?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      status: "error",
      message,
      ...extra,
    },
    { status, headers: { "cache-control": "no-store" } },
  );
}

export const ApiErrorEnvelopeSchema = z.object({
  status: z.enum(["error", "fail"]),
  message: z.string(),
  errors: z.record(z.array(z.string())).optional(),
});
