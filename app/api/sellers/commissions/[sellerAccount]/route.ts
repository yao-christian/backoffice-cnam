export const dynamic = "force-dynamic";

import { getSellerServiceCommissions } from "@/features/seller/seller-service-commission-list.service";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sellerAccount: string }> },
) {
  try {
    const sellerAccountId = (await params).sellerAccount;

    const data = await getSellerServiceCommissions(sellerAccountId);

    return Response.json({ data });
  } catch (error) {
    throw error;
  }
}
