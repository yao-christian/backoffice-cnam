import { Prisma } from "@prisma/client";

export const AUDIT_LOG_SELECT = {
  id: true,
  entity: true,
  entityId: true,
  userId: true,
  action: true,
  description: true,
  timestamp: true,
  changes: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
} satisfies Prisma.AuditLogSelect;

export type AuditLog = Prisma.AuditLogGetPayload<{
  select: typeof AUDIT_LOG_SELECT;
}>;
