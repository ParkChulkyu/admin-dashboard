"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    } else {
      alert("장바구니가 비어 있습니다.");
      router.push("/");
    }
  }, [router]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const submitOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    setIsOrdering(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/orders",
        {
          items: cart.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("주문이 완료되었습니다.");
      localStorage.removeItem("cart");
      router.push(`/orders/${res.data.id}`);
    } catch (err) {
      console.error("❌ 주문 실패", err);
      alert("주문 처리에 실패했습니다.");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🧾 주문 확인 및 결제</h1>

      <div className="bg-white border rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">주문 상품</h2>
        <ul className="divide-y">
          {cart.map((item) => (
            <li key={item.productId} className="py-2 flex justify-between">
              <div>
                {item.name} x {item.quantity}
              </div>
              <div>{(item.price * item.quantity).toLocaleString()}원</div>
            </li>
          ))}
        </ul>

        <div className="text-right font-bold text-xl mt-4">
          총 결제 금액: {totalPrice.toLocaleString()}원
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={submitOrder}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={isOrdering}
        >
          {isOrdering ? "처리 중..." : "✅ 주문 확정"}
        </button>
      </div>
    </div>
  );
}
