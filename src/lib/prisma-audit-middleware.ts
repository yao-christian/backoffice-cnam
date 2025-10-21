import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { shallowDiff, writeAudit } from "@/features/audit/audit.service";

const MUT = new Set<Prisma.PrismaAction>([
  "create",
  "update",
  "delete",
  "upsert",
  "createMany",
  "updateMany",
  "deleteMany",
]);

// configuration simple
const IGNORE_MODELS = new Set([
  "AuditLog",
  "VerificationToken",
  "PasswordResetToken",
]);
const ACTION_LABEL: Record<string, string> = {
  create: "CREATE",
  update: "UPDATE",
  delete: "DELETE",
  upsert: "UPSERT",
  createMany: "CREATE_MANY",
  updateMany: "UPDATE_MANY",
  deleteMany: "DELETE_MANY",
};

export function registerAuditMiddleware({ softFail = true } = {}) {
  prisma.$use(async (params, next) => {
    if (!params.model || !MUT.has(params.action)) {
      return next(params);
    }

    const model = params.model; // ex: "Sale"
    if (IGNORE_MODELS.has(model)) {
      return next(params);
    }

    // Lire l'état avant pour UPDATE/DELETE (si possible)
    let before: any = null;
    try {
      if (params.action === "update" || params.action === "delete") {
        before = await (prisma as any)[model.toLowerCase()].findFirst({
          where: (params.args as any)?.where,
        });
      }
    } catch {}

    // Exécuter l'opération
    const result = await next(params);

    // Lire l'état après (pour CREATE/UPDATE/UPSERT)
    let after: any = null;
    try {
      if (["create", "update", "upsert"].includes(params.action)) {
        after = result;
      }
    } catch {}

    // Déterminer entityId
    const entity = model.toLowerCase();
    const entityId = String(after?.id ?? before?.id ?? "");

    // Préparer changes
    const changes = { before, after, diff: shallowDiff(before, after) };

    // Écrire l’audit (avec ton service → description par défaut + ALS userId)
    const action = ACTION_LABEL[params.action] ?? params.action.toUpperCase();
    const write = () =>
      writeAudit(prisma, {
        entity,
        entityId,
        action,
        changes,
      });

    if (softFail) {
      // Non-bloquant par défaut
      await write().catch(() => {});
    } else {
      // Bloquant: si l'audit échoue, on remonte l'erreur
      await write();
    }

    return result;
  });
}
