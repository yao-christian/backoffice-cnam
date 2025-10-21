// utils/errors/base-error.ts
export type ErrorKind =
  | "UNKNOWN_ERROR"
  | "HTTP_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "UNAVAILABLE"
  | "BAD_REQUEST"
  | "INTERNAL_SERVER_ERROR"
  | "VALIDATION_ERROR"
  | "APPLICATION_ERROR"
  | "INSUFFICIENT_FUNDS"
  | "INVALID_DOMAIN"
  | "CUSTOM";

export interface BaseErrorOptions {
  kind?: ErrorKind;
  isOperational?: boolean;
  cause?: unknown;
  statusCode?: number; // optionnel ici (HttpError l’imposera)
}

export class BaseError extends Error {
  readonly kind: ErrorKind;
  readonly isOperational: boolean;
  readonly timestamp: string;
  readonly statusCode?: number;
  readonly cause?: unknown;

  constructor(message: string, opts: BaseErrorOptions = {}) {
    super(message);
    this.name = new.target.name;
    this.kind = opts.kind ?? "UNKNOWN_ERROR";
    this.isOperational = opts.isOperational ?? true;
    this.timestamp = new Date().toISOString();
    this.statusCode = opts.statusCode;
    this.cause = opts.cause;

    Error.captureStackTrace?.(this, new.target);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      kind: this.kind,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      statusCode: this.statusCode,
    };
  }
}

export class HttpError extends BaseError {
  readonly statusCode: number;

  constructor(
    message: string,
    statusCode: number,
    kind: ErrorKind = "HTTP_ERROR",
    opts: Omit<BaseErrorOptions, "kind" | "statusCode"> = {},
  ) {
    super(message, { ...opts, kind, statusCode });
    this.statusCode = statusCode;
  }

  static fromResponse(response: Response): HttpError {
    const messageMap: Record<number, string> = {
      400: "Requête invalide.",
      401: "L'utilisateur n'est pas authentifié.",
      403: "Accès refusé.",
      404: "Ressource introuvable.",
      408: "Délai d'attente dépassé.",
      422: "Erreur de validation.",
      500: "Erreur interne du serveur.",
      502: "Passerelle invalide.",
      503: "Service temporairement indisponible.",
      504: "Temps d'attente du serveur dépassé.",
    };

    const kindMap: Record<number, string> = {
      400: "BAD_REQUEST",
      401: "UNAUTHENTICATED",
      403: "FORBIDDEN",
      404: "NOT_FOUND",
      408: "HTTP_ERROR",
      422: "VALIDATION_ERROR",
      500: "INTERNAL_SERVER_ERROR",
      502: "HTTP_ERROR",
      503: "UNAVAILABLE",
      504: "HTTP_ERROR",
    };

    const status = response.status;
    const message = messageMap[status] ?? `Erreur HTTP ${status}`;
    const kind = (kindMap[status] ?? "HTTP_ERROR") as any;

    return new HttpError(message, status, kind);
  }
}

export class CustomError extends BaseError {
  constructor(message = "Une erreur s'est produite, veuillez réessayer !") {
    super(message, { kind: "CUSTOM", statusCode: 500 });
  }
}

// HTTP
export class UserNotAuthenticatedError extends HttpError {
  constructor(message = "L'utilisateur n'est pas connecté.") {
    super(message, 401, "UNAUTHENTICATED");
  }
}
export class NotFoundError extends HttpError {
  constructor(message = "Ressource introuvable.") {
    super(message, 404, "NOT_FOUND");
  }
}
export class UnavailableError extends HttpError {
  constructor(message = "Service temporairement indisponible.") {
    super(message, 503, "UNAVAILABLE");
  }
}
export class InvalidDomainError extends HttpError {
  constructor(message = "Domaine invalide ou non autorisé.") {
    super(message, 400, "INVALID_DOMAIN");
  }
}
export class InsufficientFundsError extends HttpError {
  constructor(message = "Fonds insuffisants pour cette opération.") {
    super(message, 402, "INSUFFICIENT_FUNDS");
  }
}

// Validation (souvent 422 avec Laravel)
export class ValidationError extends HttpError {
  constructor(message = "Erreur de validation", details?: unknown) {
    super(message, 422, "VALIDATION_ERROR", { cause: details });
  }
}
