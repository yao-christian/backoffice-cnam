import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role: {
        code: string;
        name: string;
      };
    };
  }

  interface User extends DefaultSession["user"] {
    emailVerified: Date | null;
  }
}
