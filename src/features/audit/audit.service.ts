import { prisma } from "@/lib/prisma";
import { getRequestContext } from "@/lib/request-context";
import type { Prisma } from "@prisma/client";

type AuditInput = {
  entity: string;
  entityId: string;
  action: string; // "CREATE" | "UPDATE" | "DELETE" | ...
  changes?: any; // { before?, after?, diff? }
  description?: string; // optionnel
  userId?: string; // optionnel (sinon contexte)
};

function defaultDescription(a: AuditInput) {
  const tail = a.changes ? ` changes=${JSON.stringify(a.changes)}` : "";
  return `${a.action} ${a.entity} [${a.entityId}]${tail}`;
}

export async function writeAudit(
  tx: Prisma.TransactionClient | typeof prisma,
  input: AuditInput,
) {
  const ctx = getRequestContext();
  const userId = input.userId ?? ctx.userId ?? null;
  const description = input.description ?? defaultDescription(input);

  return tx.auditLog.create({
    data: {
      entity: input.entity,
      entityId: input.entityId,
      action: input.action,
      description,
      changes: input.changes ?? {},
      userId,
    },
  });
}

export function shallowDiff(before: any, after: any) {
  if (!before || !after) return undefined;
  const out: Record<string, { from: any; to: any }> = {};
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const k of keys) {
    const bv = (before as any)[k];
    const av = (after as any)[k];
    if (typeof bv === "object" || typeof av === "object") continue; // évite les gros objets
    if (bv !== av) out[k] = { from: bv, to: av };
  }
  return Object.keys(out).length ? out : undefined;
}
