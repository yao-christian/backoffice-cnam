import { v4 as uuid4 } from "uuid";

import { prisma } from "@/lib/prisma";
import { ngserEmailService } from "@/email/services/ngser-email.service";
import { render as renderEmail } from "@react-email/render";
import PasswordResetToken from "emailspassword-reset-token";

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
}

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch (error) {
    return null;
  }
}

export async function generateVerificationToken(email: string) {
  const token = uuid4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: { email, token, expires },
  });

  return verificationToken;
}

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordResetToken;
  } catch (error) {
    return null;
  }
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  return passwordResetToken;
}

export async function sendPasswordResetTokenEmail(
  email: string,
  token: string,
) {
  const confirmLink = `${process.env.AUTH_URL}/new-password?token=${token}`;

  const emailHtml = await renderEmail(PasswordResetToken({ confirmLink }));

  await ngserEmailService({
    from: process.env.SENDER_EMAIL!,
    to: email,
    subject: "REINITIALISATION DE MOT DE PASSE",
    html: emailHtml,
  });
}

export const getAuthUser = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};
