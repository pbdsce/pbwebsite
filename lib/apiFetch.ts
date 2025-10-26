import { auth } from "@/Firebase";

export async function apiFetch(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;

  const token = user ? await user.getIdToken() : null;

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...options, headers });
}