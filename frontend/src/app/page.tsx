// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("상품 로딩 실패", err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🛍️ 전체 상품</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="border p-4 rounded hover:shadow"
          >
            <h2 className="font-semibold text-lg mb-2">{product.name}</h2>
            <p className="text-gray-600">₩{product.price.toLocaleString()}</p>
            <p className="text-sm text-gray-400">재고: {product.stock}개</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
