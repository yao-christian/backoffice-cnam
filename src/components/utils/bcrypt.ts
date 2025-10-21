import * as bcrypt from "bcryptjs";

import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";

const rounds: number = 10;

export const bcryptHash = async (hashString: string) => {
  return await bcrypt.hash(hashString, rounds);
};

export const bcryptCompare = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword);
};

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

export type JwtPayload = {
  sub: string; // user id
  email: string;
  roleCode?: string;
};

export async function signJwt(payload: JwtPayload, exp = "1h") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyJwt<T = JwtPayload>(token: string): Promise<T> {
  const { payload } = await jwtVerify(token, secret);
  return payload as T;
}

export async function getAuthUser(
  req: NextRequest,
): Promise<JwtPayload | null> {
  // const authHeader = request.headers.get("authorization") || "";
  // const token = authHeader.replace(/^Bearer\s+/i, "");
  // const jwt = await verifyJwt(token);

  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;

  try {
    const payload = await verifyJwt(match[1]);
    return payload;
  } catch {
    return null;
  }
}
