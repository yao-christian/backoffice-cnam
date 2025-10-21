import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/prisma";
import { AuthSession } from "@/features/auth/auth.types";
import { AuthSessionSchema } from "@/features/auth/auth.schema";

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await auth.api.getSession({ headers: headers() });

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      image: true,
      phoneNumber: true,
      emailVerified: true,
      role: { select: { name: true, code: true } },
    },
  });

  if (!user || !user.role) return null;

  const shaped = {
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      image: user.image ?? undefined,
      phoneNumber: user.phoneNumber ?? undefined,
      emailVerified: user.emailVerified ?? undefined,
      role: { name: user.role.name, code: user.role.code },
    },
  };

  return AuthSessionSchema.parse(shaped);
}
