import { Prisma } from "@prisma/client";

export const DEPOSIT_SELECT = {
  id: true,
  amount: true,
  depositDate: true,
  amountBefore: true,
  slipFileUrl: true,
  slipFileName: true,
  slipNumber: true,
  createdAt: true,
  bank: true,
  updatedAt: true,
  sellerAccount: {
    select: { seller: true },
  },
} satisfies Prisma.SellerDepositSelect;

export type Deposit = Prisma.SellerDepositGetPayload<{
  select: typeof DEPOSIT_SELECT;
}>;
