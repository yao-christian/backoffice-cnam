import { auth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

// export const { POST, GET } = toNextJsHandler(auth);

export async function POST(request: Request) {
  const body = await request.json();

  // Transférer la requête à Laravel
  const laravelResponse = await fetch(
    "https://votre-api-laravel.com/api/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  return laravelResponse;
}
