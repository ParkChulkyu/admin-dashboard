"use client";

import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // ✅ 이게 맞는 거야
import axios from "axios";
import { useAdminAuth } from "../../hooks/useAdminAuth";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

export default function ProductPage() {
  // const router = useRouter();
  const { loading } = useAdminAuth(); // ✅ 관리자 확인 중인지 상태
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!loading) {
      fetchProducts(); // ✅ 관리자 인증 완료 후 상품 로드
    }
  }, [loading]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch {
      alert("상품 목록을 불러올 수 없습니다.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(
          `http://localhost:8000/api/products/${editId}`,
          { name, price, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/products",
          { name, price, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      resetForm();
      fetchProducts();
    } catch (e) {
      console.log(e);
      alert("저장 실패");
    }
  };

  const handleEdit = (product: Product) => {
    setEditId(product.id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch {
      alert("삭제 실패");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPrice(0);
    setDescription("");
  };

  if (loading) return <div className="p-6">⏳ 관리자 확인 중...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">🛒 상품 관리</h1>

      {/* 상품 등록/수정 폼 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="상품명"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="number"
          placeholder="가격"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editId ? "수정 완료" : "상품 등록"}
        </button>
        {editId && (
          <button
            onClick={resetForm}
            className="ml-2 px-4 py-2 border rounded text-gray-600"
          >
            취소
          </button>
        )}
      </div>

      {/* 상품 목록 테이블 */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">상품명</th>
            <th className="p-2">가격</th>
            <th className="p-2">설명</th>
            <th className="p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t text-center">
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.price.toLocaleString()}원</td>
              <td className="p-2">{p.description}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 mr-2"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600"
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
