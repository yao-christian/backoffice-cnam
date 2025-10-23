import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function GET(req: Request) {
  cookies().delete("auth_token");
  cookies().delete("user_session");
  return NextResponse.redirect(new URL("/login", env.NEXT_PUBLIC_BASE_URL));
}
