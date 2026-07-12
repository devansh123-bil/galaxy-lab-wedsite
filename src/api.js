const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function assetUrl(path) {
  if (!path) return "https://images.unsplash.com/photo-1581093458791-9d09f85a7a3e?auto=format&fit=crop&w=900&q=80";
  return path.startsWith("http") ? path : `${API_URL}${path}`;
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("adminToken");
  const headers = options.body instanceof FormData ? {} : { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
      signal: options.signal || controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  } finally {
    window.clearTimeout(timeout);
  }
}
