import { cookies } from "next/headers";
import { UserResponse, AuthSession } from "./auth.types";
import { APIServerIntance } from "./auth-api";
import { redirect } from "next/navigation";

const TOKEN_COOKIE_NAME = "auth_token";
const USER_SESSION_COOKIE_NAME = "user_session";

export function setAuthToken(token: string) {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  });
}

export function getAuthToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

export function removeAuthToken() {
  const cookieStore = cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

export function setUserSession(userSession: string) {
  const cookieStore = cookies();
  cookieStore.set(USER_SESSION_COOKIE_NAME, userSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  });
}

export function getUserSession(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(USER_SESSION_COOKIE_NAME)?.value;
}

export function removeUserSession() {
  const cookieStore = cookies();
  cookieStore.delete(USER_SESSION_COOKIE_NAME);
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return !!token;
}

export function logoutAction() {
  removeAuthToken();
  removeUserSession();
  redirect("/login");
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  // Try to get user from session cookie first
  const sessionData = getUserSession();
  if (sessionData) {
    try {
      return JSON.parse(sessionData) as AuthSession;
    } catch (error) {
      console.error("[v0] Failed to parse user session:", error);
    }
  }

  // If no session data, fetch from API and store it
  try {
    const userResponse: UserResponse = await APIServerIntance.getUser(token);
    if (userResponse.data) {
      setUserSession(JSON.stringify(userResponse.data));
      return userResponse.data;
    }
    return null;
  } catch (error) {
    console.error("[v0] Get user error:", error);
    return null;
  }
}

export async function refreshUserSession(): Promise<AuthSession | null> {
  const token = getAuthToken();

  if (!token) {
    return null;
  }

  try {
    const userResponse: UserResponse = await APIServerIntance.getUser(token);
    if (userResponse.data) {
      setUserSession(JSON.stringify(userResponse.data));
      return userResponse.data;
    }
    return null;
  } catch (error) {
    console.error("[v0] Refresh user error:", error);
    return null;
  }
}
