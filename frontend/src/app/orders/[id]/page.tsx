"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";

type OrderItem = {
  product_id: number;
  product: { name: string };
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
  items: OrderItem[];
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    axios
      .get(`http://localhost:8000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrder(res.data))
      .catch((err) => console.error("주문 조회 실패", err));
  }, [id]);

  if (!order) return <div className="p-4">로딩 중...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧾 주문 상세</h1>
      <p className="mb-2">
        주문번호: <strong>{order.id}</strong>
      </p>
      <p className="mb-2">
        주문일: {dayjs(order.created_at).format("YYYY-MM-DD HH:mm")}
      </p>
      <p className="mb-4">상태: {order.status}</p>

      <h2 className="text-lg font-semibold mb-2">📦 주문 상품</h2>
      <ul className="border rounded divide-y">
        {order.items.map((item, idx) => (
          <li key={idx} className="p-3 flex justify-between">
            <span>
              {item.product.name} (x{item.quantity})
            </span>
            <span>₩{(item.price * item.quantity).toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <div className="text-right font-bold text-xl mt-4">
        총 결제 금액: ₩{order.total_price.toLocaleString()}
      </div>
    </div>
  );
}
