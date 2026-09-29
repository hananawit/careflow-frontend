const API_URL = "http://localhost:3000";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let message = errorText || `Request failed with status ${response.status}`;

    try {
      const errorBody: unknown = JSON.parse(errorText);
      if (errorBody && typeof errorBody === "object" && "message" in errorBody) {
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
}
