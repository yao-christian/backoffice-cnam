import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    UPLOAD_DIR: z.string().min(1),
    STORAGE_TYPE: z.string().min(1),

    // Email
    BASE_URL_NGSER_MAIL_API: z.string().min(1),
    USERNAME_NGSER_EMAIL_API: z.string().min(1),
    PASSWORD_NGSER_EMAIL_API: z.string().min(1),
    SENDER_EMAIL: z.string().min(1),
    RECIPIENT_EMAIL: z.string().min(1),

    // Next AUth
    AUTH_SECRET: z.string().min(10),
    AUTH_TRUST_HOST: z.string().min(1),
    OAUTH_CLIENT_ID: z.string().min(1),
    OAUTH_CLIENT_SECRET: z.string().min(1),
    API_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
  },

  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
