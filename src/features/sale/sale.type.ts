import { z } from "zod";
import { Prisma } from "@prisma/client";
import { CreateSaleSchema } from "./schemas/create-sale-schema";

export const SALE_SELECT = {
  id: true,
  balanceAfter: true,
  balanceBefore: true,
  quantity: true,
  amount: true,
  createdAt: true,
  updatedAt: true,
  service: true,
  seller: true,
} satisfies Prisma.SaleSelect;

export type Sale = Prisma.SaleGetPayload<{
  select: typeof SALE_SELECT;
}>;

export type CreateSaleDTO = z.infer<typeof CreateSaleSchema> & {
  sellerId: string;
};

export type CreateSaleResponse = {
  success: boolean;
  message: string;
  saleId?: string;
  data?: {
    serviceCode: string;
    sellerId: string;
    serviceQty: number;
    totalAmount: number;
    balanceAfter: number;
  };
};

export type SaleStatus = "pending" | "completed" | "failed";

export type SaleSummary = {
  saleId: string;
  timestamp: string;
  status: SaleStatus;
} & Pick<CreateSaleDTO, "serviceCode" | "sellerId" | "serviceQty">;
