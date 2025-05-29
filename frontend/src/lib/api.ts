// src/lib/api.ts
import { LoginData, RegisterData } from "@/types/auth";

const API = process.env.NEXT_PUBLIC_API_URL;

// Laravel - 로그인에 대한 요청
export async function login(data: LoginData) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

// Laravel - 회원가입에 대한 요청
export async function register(data: RegisterData) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}
