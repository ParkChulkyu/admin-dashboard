"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
};

type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => router.push("/"));
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const cartJson = localStorage.getItem("cart");
    const cart: CartItem[] = cartJson ? JSON.parse(cartJson) : [];

    const existing = cart.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("🛒 장바구니에 담았습니다!");
  };

  const orderNow = async () => {
    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/orders",
        {
          items: [{ product_id: product?.id, quantity }],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ 주문 응답:", res.data);
      alert("주문 완료!");
      router.push("/orders");
    } catch (err) {
      console.error("❌ 주문 실패", err);
      alert("주문에 실패했습니다.");
    }
  };

  if (!product) return <div>로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p className="text-xl font-semibold">
        {product.price.toLocaleString()}원
      </p>
      <input
        type="number"
        min={1}
        max={product.stock}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border px-2 py-1 rounded mt-2"
      />
      <div className="mt-4 flex gap-3">
        <button
          onClick={addToCart}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          🛒 장바구니 담기
        </button>
        <button
          onClick={orderNow}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          🛍️ 바로 주문하기
        </button>
      </div>
    </div>
  );
}
