// /lib/api.js
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5566";

async function handle(res, method, path) {
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${method} ${path} ${res.status} ${txt}`.trim());
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

export async function apiGet(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, { cache: "no-store", ...init });
  return handle(res, "GET", path);
}

export async function apiPost(path, body, init) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    body: JSON.stringify(body),
    ...init,
  });
  return handle(res, "POST", path);
}

// ------- Endpoints del mock -------
export async function getUser(userId = "1") {
  return apiGet(`/users/${userId}`);
}

export async function getAccount(accountId) {
  return apiGet(`/accounts/${accountId}`);
}

export async function getAccountTx(accountId) {
  return apiGet(`/accounts/${accountId}/transactions`);
}

export async function createTransaction({ amountCurrency, amountValue, origin, destination }) {
  const payload = {
    amount: { currency: amountCurrency, value: Number(amountValue) },
    origin: String(origin),
    destination: String(destination),
  };
  return apiPost(`/transactions`, payload);
}
