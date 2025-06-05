"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";

type Order = {
  id: number;
  total_price: number;
  status: string;
  created_at: string;
};

export default function OrderListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    axios
      .get("http://localhost:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch(() => alert("주문 정보를 불러오지 못했습니다."));
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">📦 내 주문 목록</h1>

      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border rounded p-4 shadow hover:bg-gray-50"
            >
              <Link href={`/orders/${order.id}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">주문번호 #{order.id}</p>
                    <p className="text-sm text-gray-500">
                      주문일: {dayjs(order.created_at).format("YYYY-MM-DD")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      ₩{order.total_price.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">{order.status}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
