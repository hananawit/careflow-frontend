import keycloak from "../auth/keycloak";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const headers = new Headers(options?.headers);

  headers.set("Content-Type", "application/json");

  if (keycloak.authenticated) {
    await keycloak.updateToken(30);
  }

  if (keycloak.token) {
    headers.set("Authorization", `Bearer ${keycloak.token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `Request failed with status ${response.status}`;

    try {
      const errorBody: unknown = JSON.parse(errorText);

      if (
        errorBody &&
        typeof errorBody === "object" &&
        "message" in errorBody
      ) {
        const apiMessage = errorBody.message;

        message = Array.isArray(apiMessage)
          ? apiMessage.join(", ")
          : String(apiMessage);
      }
    } catch {
      // Non-JSON error responses retain their response text.
    }

    throw new Error(message);
  }

  return response.json();
}export type CurrentUser = {
  id: string;
  keycloakId: string;
  email: string;
  status: string;
  roles: string[];
  permissions: string[];
};

export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>("/auth/me");
}
