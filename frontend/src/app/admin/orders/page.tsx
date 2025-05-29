"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Order = {
  id: number;
  user: { name: string };
  product: { name: string };
  quantity: number;
  status: string;
  created_at: string;
};

export default function OrderPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) return router.push("/login");
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      router.push("/login");
    }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      await axios.put(
        `http://localhost:8000/api/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch {
      alert("상태 변경 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">📦 주문 관리</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">사용자</th>
            <th className="p-2">상품</th>
            <th className="p-2">수량</th>
            <th className="p-2">상태</th>
            <th className="p-2">주문일</th>
            <th className="p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center border-t">
              <td className="p-2">{order.id}</td>
              <td className="p-2">{order.user?.name}</td>
              <td className="p-2">{order.product?.name}</td>
              <td className="p-2">{order.quantity}</td>
              <td className="p-2">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="대기">대기</option>
                  <option value="완료">완료</option>
                  <option value="취소">취소</option>
                </select>
              </td>
              <td className="p-2">
                {new Date(order.created_at).toLocaleDateString("ko-KR")}
              </td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(order.id)}
                  className="text-red-500"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
