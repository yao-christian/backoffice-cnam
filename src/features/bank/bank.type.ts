import { Prisma } from "@prisma/client";

export const BANK_SELECT = {
  id: true,
  name: true,
} satisfies Prisma.BankSelect;

export type Bank = Prisma.UserGetPayload<{
  select: typeof BANK_SELECT;
}>;
