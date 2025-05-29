"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
};

export default function AdminUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [adminOnly, setAdminOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchUsers(1); // 초기 페이지는 1
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      const res = await axios.get("/api/users", {
        params: {
          page: page,
          search: search,
          admin_only: adminOnly,
        },
      });
      setUsers(res.data.data); // 🔄 paginate 응답에서 실제 데이터
      setCurrentPage(res.data.current_page);
      setLastPage(res.data.last_page);
    } catch (error) {
      console.error("유저 목록 불러오기 실패:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  };

  const handleSearch = () => {
    fetchUsers(1); // 검색 시 항상 1페이지부터
  };

  const toggleAdminRole = async (id: number, isAdmin: boolean) => {
    try {
      await axios.put(`/api/users/${id}/role`, {
        is_admin: !isAdmin,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, is_admin: !isAdmin } : user
        )
      );
    } catch (error) {
      console.error("관리자 권한 변경 실패:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">유저 목록 (관리자 권한 설정)</h1>

      {/* 🔍 검색 UI */}
      <div className="mb-4 flex gap-4 items-center">
        <input
          type="text"
          placeholder="이름 또는 이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={adminOnly}
            onChange={(e) => setAdminOnly(e.target.checked)}
          />
          관리자만 보기
        </label>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

      {/* 📋 유저 테이블 */}
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">ID</th>
            <th className="p-2">이름</th>
            <th className="p-2">이메일</th>
            <th className="p-2">권한</th>
            <th className="p-2">관리자 전환</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center border-t">
              <td className="p-2">{user.id}</td>
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.is_admin ? "관리자" : "일반 유저"}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleAdminRole(user.id, user.is_admin)}
                  className={`px-3 py-1 rounded ${
                    user.is_admin
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {user.is_admin ? "관리자 해제" : "관리자로 변경"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ⬅️➡️ 페이지네이션 버튼 */}
      <div className="mt-4 flex gap-2 justify-center">
        {Array.from({ length: lastPage }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded border ${
              currentPage === pageNum ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}
