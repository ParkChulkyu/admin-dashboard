// app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import type { Product } from "@/app/page";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => router.push("/"));
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const cartJson = localStorage.getItem("cart");
    const cart = cartJson ? JSON.parse(cartJson) : [];

    const existing = cart.find((item: any) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId: product.id, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("장바구니에 담겼습니다!");
  };

  const goToCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    // 바로 주문: 임시로 장바구니에 넣고 checkout으로 이동
    addToCart();
    router.push("/checkout");
  };

  if (!product) return <div>상품 정보를 불러오는 중...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛍️ {product.name}</h1>
      <p className="text-gray-700 mb-2">
        가격: ₩{product.price.toLocaleString()}
      </p>
      <p className="text-sm text-gray-500 mb-4">재고: {product.stock}개</p>

      <div className="flex items-center mb-4">
        <label className="mr-2">수량:</label>
        <input
          type="number"
          min={1}
          max={product.stock}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-20 border px-2 py-1 rounded"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={addToCart}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          장바구니 담기
        </button>
        <button
          onClick={goToCheckout}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          바로 주문하기
        </button>
      </div>
    </div>
  );
}
