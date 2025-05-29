"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// ✅ 관리자 권한 확인용 커스텀 훅
export function useAdminAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ⛔ 토큰 없으면 로그인으로 리디렉션
    if (!token) {
      router.push("/login");
      return;
    }

    // ✅ 관리자 확인 요청
    axios
      .get("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.data.is_admin) {
          router.push("/"); // 일반 유저 접근 차단
        } else {
          setLoading(false); // 관리자일 경우 통과
        }
      })
      .catch(() => {
        router.push("/login"); // 토큰이 유효하지 않으면 로그인으로 이동
      });
  }, []);

  return { loading }; // 페이지에서 로딩 여부 체크 가능
}
