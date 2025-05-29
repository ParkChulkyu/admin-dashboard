"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import axios from "axios"; // ✅ axios도 import 필요!

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });

      if (res.token) {
        localStorage.setItem("token", res.token);

        // ✅ 이건 단순 테스트용 요청 (선택사항)
        const testRes = await axios.get("http://localhost:8000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${res.token}`,
          },
        });

        console.log("관리자 확인 응답:", testRes.data);

        // ✅ 관리자 인증 확인 후 이동
        router.push("/admin/dashboard");
      } else {
        alert("로그인 실패: " + res.message);
      }
    } catch (err: any) {
      console.error(err);
      alert("서버 오류: " + (err?.response?.data?.message ?? "Unknown error"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-black text-white p-2 rounded">
          로그인
        </button>
      </form>
    </div>
  );
}
