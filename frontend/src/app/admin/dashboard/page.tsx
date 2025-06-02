"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

type Product = {
  name: string;
};

type OrderItem = {
  product: Product | null;
  quantity: number;
};

type Order = {
  id: number;
  user: { name: string } | null;
  items: OrderItem[];
  created_at: string;
};

type DashboardStats = {
  product_count: number;
  order_count: number;
  user_count: number;
  recent_orders: Order[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    product_count: 0,
    order_count: 0,
    user_count: 0,
    recent_orders: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    axios
      .get("http://localhost:8000/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStats(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6">📊 관리자 대시보드</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card
          title="상품 수"
          value={stats.product_count}
          color="text-blue-600"
        />
        <Card
          title="주문 수"
          value={stats.order_count}
          color="text-green-600"
        />
        <Card
          title="회원 수"
          value={stats.user_count}
          color="text-purple-600"
        />
      </div>

      {/* 최근 주문 */}
      <h2 className="text-2xl font-semibold mb-4">🧾 최근 주문 5건</h2>
      <div className="space-y-4">
        {stats.recent_orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border shadow rounded p-4 flex flex-col sm:flex-row justify-between sm:items-center"
          >
            <div>
              <p className="font-semibold">주문 ID: {order.id}</p>
              <p className="text-sm text-gray-600">
                주문일:{" "}
                {new Date(order.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            </div>
            <div className="text-sm text-gray-700 mt-2 sm:mt-0 sm:text-right">
              사용자: <strong>{order.user?.name || "알 수 없음"}</strong>
              <br />
              {order.items.length === 0 ? (
                <span>상품 정보 없음</span>
              ) : (
                order.items.map((item, index) => (
                  <div key={index}>
                    상품: <strong>{item.product?.name || "알 수 없음"}</strong>{" "}
                    / 수량: <strong>{item.quantity}</strong>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 📦 카드 UI 컴포넌트
function Card({
  title,
  value,
  color = "text-gray-800",
}: {
  title: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white border shadow rounded p-4 text-center">
      <h2 className="text-lg text-gray-500">{title}</h2>
      <p className={`text-2xl font-bold mt-2 ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}
