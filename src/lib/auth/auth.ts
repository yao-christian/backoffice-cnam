import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: async ({
        password,
        hash,
      }: {
        password: string;
        hash: string;
      }) => {
        return bcrypt.compare(password, hash);
      },
    },
  },
  user: {
    fields: {
      name: "fullName",
    },
    additionalFields: {
      lastName: { type: "string", required: true },
      firstName: { type: "string", required: false },
      phoneNumber: { type: "string", required: true },
      statusCode: { type: "number", required: true },
      statusName: { type: "string", required: true },
      roleId: { type: "string", required: true },
    },
  },
  plugins: [
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          // Send the OTP for sign in
        } else if (type === "email-verification") {
          // Send the OTP for email verification
        } else {
          // Send the OTP for password reset
        }
      },
    }),
  ],
});

/*
const data = await auth.api.sendVerificationOTP({
  body: {
    email: "user@example.com", // required
    type: "sign-in", // required
  },
});

https://www.better-auth.com/docs/plugins/email-otp
*/
