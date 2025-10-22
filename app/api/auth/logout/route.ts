import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  cookies().delete("auth_token");
  cookies().delete("user_session");
  return NextResponse.redirect(new URL("/login", req.url));
}
