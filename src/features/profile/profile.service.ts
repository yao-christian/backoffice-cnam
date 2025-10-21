"use server";

import { prisma } from "@/lib/prisma";

export async function getProfileByUserId(userId: string) {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      role: true,
      photo: true, // UserPhoto
      sellerAccount: true, // SellerAccount
    },
  });

  if (!u) return null;

  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    emailVerified: u.emailVerified ? u.emailVerified : null,
    phoneNumber: u.phoneNumber ?? null,
    role: { code: u.role.code, name: u.role.name },
    photoUrl: u.photo?.url ?? null,
    seller: u.sellerAccount
      ? {
          sellerCode: u.sellerAccount.sellerCode,
          balance: u.sellerAccount.balance,
          hasPointOfSale: u.sellerAccount.hasPointOfSale,
        }
      : null,
  } as const;
}
