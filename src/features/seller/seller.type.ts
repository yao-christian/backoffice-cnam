import { Prisma } from "@prisma/client";

export const SELLER_SELECT = {
  id: true,
  lastName: true,
  firstName: true,
  email: true,
  phoneNumber: true,
  statusCode: true,
  statusName: true,
  emailVerified: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  sellerAccount: true,
} satisfies Prisma.UserSelect;

export const SELLER_SERVICE_COMMISSION_SELECT = {
  id: true,
  commission: true,
  seller: true,
  service: true,
} satisfies Prisma.SellerServiceCommissionSelect;

export type SellerServiceCommission = Prisma.SellerServiceCommissionGetPayload<{
  select: typeof SELLER_SERVICE_COMMISSION_SELECT;
}>;

export type Seller = Prisma.UserGetPayload<{
  select: typeof SELLER_SELECT;
}>;
