export async function apiFetch(url: string, options: RequestInit = {}) {
  return fetch(url, { ...options });
}