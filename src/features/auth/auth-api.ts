type OAuthTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type LoginResponse = {
  status: string;
  message: string;
  data: { token: string };
};

class APIServer {
  private baseUrl: string;
  private clientId: string;
  private clientSecret: string;

  constructor() {
    this.baseUrl = process.env.API_URL || "";
    this.clientId = process.env.OAUTH_CLIENT_ID || "";
    this.clientSecret = process.env.OAUTH_CLIENT_SECRET || "";
  }

  // Étape 1 : Obtenir l'access_token OAuth (SERVEUR UNIQUEMENT)
  async getOAuthToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get OAuth token");
    }

    const data: OAuthTokenResponse = await response.json();
    return data.access_token;
  }

  // Étape 2 : Login avec l'access_token pour obtenir le token utilisateur
  async login(email: string, password: string): Promise<LoginResponse> {
    const accessToken = await this.getOAuthToken();

    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ login: email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  }

  // Faire une requête authentifiée avec le token utilisateur
  async authenticatedRequest(
    endpoint: string,
    token: string,
    options: RequestInit = {},
  ) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }

    return response.json();
  }

  async getUser(token: string): Promise<any> {
    return this.authenticatedRequest("/api/auth/me", token);
  }
}

export const APIServerIntance = new APIServer();

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

// Faire une requête authentifiée avec le token utilisateur (CLIENT)
export async function authenticatedRequest(
  endpoint: string,
  token: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}
