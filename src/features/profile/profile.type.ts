export type ProfileRoleCode = "ADMIN" | "SUPER_ADMIN" | "SELLER" | string;

export type ProfileUser = {
  id: string;
  firstName: string | null;
  lastName: string;
  email: string;
  emailVerified: string | null; // ISO string or null
  phoneNumber: string | null;
  role: { code: ProfileRoleCode; name: string };
  photoUrl: string | null;
  seller?: {
    sellerCode: string;
    balance: number;
    hasPointOfSale: boolean;
  } | null;
};
