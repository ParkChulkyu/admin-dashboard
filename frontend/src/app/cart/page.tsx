"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// ✅ CartItem 타입 정의
type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  // ✅ 장바구니 불러오기
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  // ✅ 수량 변경
  const updateQuantity = (productId: number, newQty: number) => {
    const updated = cart.map((item) =>
      item.productId === productId ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ 항목 삭제
  const removeItem = (productId: number) => {
    const updated = cart.filter((item) => item.productId !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // ✅ 전체 비우기
  const clearCart = () => {
    if (confirm("장바구니를 비우시겠습니까?")) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };

  // ✅ 총 합계 계산
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ 주문하기
  const orderNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/orders",
        {
          items: cart.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ 주문 성공:", res.data);
      alert("주문이 완료되었습니다.");
      localStorage.removeItem("cart");
      router.push("/orders");
    } catch (err) {
      console.error("❌ 주문 실패", err);
      alert("주문 실패");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">🛒 장바구니가 비어 있어요</h1>
        <p className="text-gray-600">상품을 담아주세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🛒 장바구니</h1>

      <table className="w-full border mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">상품명</th>
            <th className="p-2">가격</th>
            <th className="p-2">수량</th>
            <th className="p-2">합계</th>
            <th className="p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.productId} className="text-center border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.price.toLocaleString()}원</td>
              <td className="p-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.productId, Number(e.target.value))
                  }
                  className="w-16 border rounded text-center"
                />
              </td>
              <td className="p-2">
                {(item.price * item.quantity).toLocaleString()}원
              </td>
              <td className="p-2">
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mb-6">
        <button
          onClick={clearCart}
          className="text-sm text-gray-500 hover:underline"
        >
          ❌ 장바구니 비우기
        </button>
        <div className="text-right font-semibold text-xl">
          총 합계: {totalPrice.toLocaleString()}원
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={orderNow}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          ✅ 주문하기
        </button>
      </div>
    </div>
  );
}
