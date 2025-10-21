import { CustomError } from "@/utils/errors";
import { ngserEmailService } from "@/email/services/ngser-email.service";
import { prisma } from "@/lib/prisma";
import { render as renderEmail } from "@react-email/render";
import EmailVerificationOtp from "emails/email-verification-otp";

export async function generateVerifivationEmailOtp(email: string) {
  let otp = "";
  let isOtpExist = true;

  while (isOtpExist) {
    otp = Math.floor(1000 + Math.random() * 9000).toString();

    const existingOtp = await prisma.verificationToken.findFirst({
      where: { token: otp },
    });

    isOtpExist = !!existingOtp;
  }

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingOtp = await prisma.verificationToken.findFirst({
    where: { email },
  });

  if (existingOtp) {
    await prisma.verificationToken.delete({
      where: {
        id: existingOtp.id,
      },
    });
  }

  const verificationOtp = await prisma.verificationToken.create({
    data: { email, token: otp, expires },
  });

  return verificationOtp;
}

export async function sendVerificationEmailOtp(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!existingUser) {
    throw new CustomError("L'utilisateur n'existe pas");
  }

  const verificationToken = await generateVerifivationEmailOtp(
    existingUser.email,
  );

  const emailHtml = await renderEmail(
    EmailVerificationOtp({ otpCode: verificationToken.token }),
  );

  await ngserEmailService({
    from: process.env.SENDER_EMAIL!,
    to: email,
    subject: "CONFIRMATION EMAIL",
    html: emailHtml,
  });
}

export async function verifyVerificationEmailOtp(otp: string) {
  try {
    const existingOtp = await prisma.verificationToken.findUnique({
      where: { token: otp },
    });

    if (!existingOtp) {
      throw new CustomError("L'utilisateur n'existe pas");
    }

    const hasExpired = new Date(existingOtp.expires) < new Date();

    if (hasExpired) {
      throw new CustomError("Code otp expiré.");
    }

    await prisma.verificationToken.delete({
      where: { id: existingOtp.id },
    });

    return existingOtp;
  } catch (error) {
    throw error;
  }
}

export async function generatePasswordResetOtp(email: string) {
  let otp = "";
  let isOtpExist = true;

  // Generate unique OTP
  while (isOtpExist) {
    otp = Math.floor(1000 + Math.random() * 9000).toString();

    const existingOtp = await prisma.passwordResetToken.findFirst({
      where: { token: otp },
    });

    isOtpExist = !!existingOtp;
  }

  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingOtp = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingOtp) {
    await prisma.passwordResetToken.delete({
      where: { id: existingOtp.id },
    });
  }

  const passwordResetOtp = await prisma.passwordResetToken.create({
    data: { email, token: otp, expires },
  });

  return passwordResetOtp;
}

export async function sendPasswordResetOtp(email: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      throw new CustomError("L'utilisateur n'existe pas");
    }

    const verificationToken = await generatePasswordResetOtp(
      existingUser.email,
    );

    const emailHtml = await renderEmail(
      EmailVerificationOtp({ otpCode: verificationToken.token }),
    );

    await ngserEmailService({
      from: process.env.SENDER_EMAIL!,
      to: email,
      subject: "CONFIRMATION EMAIL",
      html: emailHtml,
    });

    return "Un code OTP a été envoyé sur votre email";
  } catch (error) {
    throw error;
  }
}

export async function verifyPasswordResetOtp(otp: string) {
  try {
    const existingOtp = await prisma.passwordResetToken.findUnique({
      where: { token: otp },
    });

    if (!existingOtp) {
      throw new CustomError("Ce code otp n'existe pas.");
    }

    const hasExpired = new Date(existingOtp.expires) < new Date();

    if (hasExpired) {
      throw new CustomError("Code otp expiré.");
    }

    await prisma.passwordResetToken.delete({
      where: { id: existingOtp.id },
    });

    return existingOtp;
  } catch (error) {
    throw error;
  }
}

export async function sendVerifivationEmailOtp(email: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!existingUser) {
      throw new CustomError("L'utilisateur n'existe pas");
    }

    const verificationToken = await generateVerifivationEmailOtp(
      existingUser.email,
    );

    await sendVerificationEmailOtp(verificationToken.email);

    return "Un nouveau code OTP a été envoyé.";
  } catch (error) {
    throw error;
  }
}
