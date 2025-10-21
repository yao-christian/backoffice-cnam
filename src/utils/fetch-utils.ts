import { HttpError } from "@/utils/errors";

export async function fetchJson(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeoutMs = 15000,
) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(input, {
      ...init,
      signal: ctrl.signal,
      cache: "no-store",
    });

    // HTTP non-OK → remonter une HttpError avec message du corps si dispo
    if (!res.ok) {
      let bodyMessage: string | undefined;
      try {
        const body = await res.json();
        bodyMessage =
          typeof body?.message === "string" ? body.message : undefined;
      } catch {
        // pas de JSON → garder message générique
      }
      throw new HttpError(
        bodyMessage || `Erreur HTTP ${res.status}`,
        res.status,
      );
    }

    // Content-Type minimal
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      throw new HttpError(
        "Réponse invalide (format non JSON).",
        502,
        "HTTP_ERROR",
      );
    }

    return res.json();
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new HttpError("Délai d'attente dépassé.", 504, "HTTP_ERROR", {
        cause: e,
      });
    }
    // Erreurs réseau
    throw new HttpError(
      "Impossible de contacter le serveur.",
      503,
      "UNAVAILABLE",
      { cause: e },
    );
  } finally {
    clearTimeout(timer);
  }
}
