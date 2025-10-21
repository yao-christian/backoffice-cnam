"use server";

import { setAuthToken, setUserSession } from "@/features/auth/auth-session";
import { CredentialsSchema } from "@/features/auth/auth.schema";
import { UserResponse } from "@/features/auth/auth.types";
import { APIServerIntance } from "@/features/auth/auth-api";

import { action } from "@/lib/safe-action";
import { redirect } from "next/navigation";

export const loginAction = action
  .schema(CredentialsSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      const response = await APIServerIntance.login(email, password);

      if (response.data.token) {
        setAuthToken(response.data.token);

        try {
          const userResponse: UserResponse = await APIServerIntance.getUser(
            response.data.token,
          );

          if (userResponse.data) {
            setUserSession(JSON.stringify(userResponse.data));
          }
        } catch (error) {
          console.error("[v0] Failed to fetch user data:", error);
        }
      }

      redirect("/");
    } catch (error: any) {
      const digest = error?.digest;

      if (typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")) {
        throw error;
      }

      console.error("[v0] Login error:", error);

      return {
        error:
          error instanceof Error
            ? error.message
            : "Email ou mot de passe incorrect",
      };
    }
  });
