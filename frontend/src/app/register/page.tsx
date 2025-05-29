"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api"; // API 호출 함수

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await register(form);

      if (res.token) {
        // ✅ 회원가입 성공 시 안내 페이지로 이동
        router.push("/register/success");
      } else {
        alert(res.message || "회원가입 실패");
      }
    } catch (err) {
      console.log(err);
      alert("서버 오류");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="이름"
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border"
        />
        <input
          name="email"
          placeholder="이메일"
          onChange={handleChange}
          required
          className="w-full mb-4 p-2 border"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          onChange={handleChange}
          required
          className="w-full mb-6 p-2 border"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}
