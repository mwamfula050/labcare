
const BASE = "http://localhost:8080/api";

export function setCredentials(username, password) {
  sessionStorage.setItem(
    "labAuth",
    btoa(`${username}:${password}`)
  );
}

export function clearCredentials() {
  sessionStorage.removeItem("labAuth");
}

export async function api(path, options = {}) {
  const auth = sessionStorage.getItem("labAuth");

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: `Basic ${auth}` } : {}),
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    throw new Error("Invalid username or password, or session expired.");
  }

  if (response.status === 403) {
    throw new Error("You do not have permission to perform this action.");
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const data = await response.json();
      message = data.message || data.error || message;
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;

  return response.json();
}

export const money = value =>
  new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency: "TZS",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
