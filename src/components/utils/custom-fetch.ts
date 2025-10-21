import { getAuthToken } from "@/features/auth/auth-session";
import { HttpError } from "../../utils/errors";

type FetchOptions = RequestInit & {
  isAuth?: boolean;
};

export async function customFetch(
  url: string | URL | Request,
  options?: FetchOptions,
) {
  try {
    const { isAuth = false, headers, ...restOptions } = options || {};

    let token: string | null | undefined = null;

    if (typeof window == "undefined") {
      token = isAuth ? getAuthToken() : null;
    } else {
      token = null;
    }

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
    };

    const finalHeaders: HeadersInit = {
      ...defaultHeaders,
      ...headers,
      ...(isAuth && token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(url, {
      ...restOptions,
      headers: finalHeaders,
    });
  } catch (e) {
    throw new HttpError(
      "Impossible de contacter le serveur. Vérifiez votre connexion ou réessayez plus tard.",
      503,
      "UNAVAILABLE",
      { cause: e },
    );
  }
}
