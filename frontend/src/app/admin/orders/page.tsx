"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

type Order = {
  id: number;
  user: { name: string; email: string };
  product: { name: string };
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  "주문 접수": "bg-gray-200 text-gray-800",
  "배송 중": "bg-yellow-200 text-yellow-900",
  완료: "bg-green-200 text-green-900",
};

export default function AdminOrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // ✅ 관리자 권한 체크
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!res.data.is_admin) router.push("/");
      })
      .catch(() => router.push("/login")); // 인증 안된 경우
  }, []);

  const fetchOrders = () => {
    axios
      .get("http://localhost:8000/api/admin/orders", {
        params: { page, search, from, to },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data.data);
        setLastPage(res.data.last_page);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, [page, search, from, to]);

  const updateStatus = (id: number, status: string) => {
    axios
      .put(
        `http://localhost:8000/api/admin/orders/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(fetchOrders);
  };

  const deleteOrder = (id: number) => {
    if (!confirm("정말 삭제할까요?")) return;
    axios
      .delete(`http://localhost:8000/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(fetchOrders);
  };

  const downloadPDF = () => {
    window.open(
      `http://localhost:8000/api/admin/orders/export-pdf?token=${token}`,
      "_blank"
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 관리자 주문 목록</h1>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="이름/이메일 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <span>~</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={downloadPDF}
          className="ml-auto bg-red-600 text-white px-4 py-2 rounded"
        >
          PDF 다운로드
        </button>
      </div>

      <table className="w-full text-sm border border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">유저</th>
            <th className="border p-2">상품</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">금액</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">주문일</th>
            <th className="border p-2">삭제</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border p-2">{order.id}</td>
              <td className="border p-2">
                {order.user?.name ?? "이름 없음"} (
                {order.user?.email ?? "이메일 없음"})
              </td>
              <td className="border p-2">
                {order.product?.name ?? "상품 없음"}
              </td>
              <td className="border p-2">{order.quantity}</td>
              <td className="border p-2">
                ₩{order.total_price.toLocaleString()}
              </td>
              <td className="border p-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`px-2 py-1 rounded ${
                    statusColors[order.status] || "bg-white"
                  }`}
                >
                  {["주문 접수", "배송 중", "완료"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border p-2">
                {dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteOrder(order.id)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex gap-2 justify-center">
        {Array.from({ length: lastPage }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              page === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
