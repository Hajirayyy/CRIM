const BASE_URL = "http://127.0.0.1:8000";

export const signup = async (email, password) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const verifyEmail = async (token) => {
  const res = await fetch(`${BASE_URL}/verify-email?token=${encodeURIComponent(token)}`);
  return { ok: res.ok, data: await res.json() };
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return { ok: res.ok, data: await res.json() };
};

export const resetPassword = async (token, new_password) => {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password }),
  });
  return { ok: res.ok, data: await res.json() };
};