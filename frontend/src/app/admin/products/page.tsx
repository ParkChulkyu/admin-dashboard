"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  created_at: string;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:8000/api/admin/products", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setProducts(res.data.data ?? res.data);
    setLoading(false);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (editingProduct) {
        await axios.put(
          `http://localhost:8000/api/admin/products/${editingProduct.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:8000/api/admin/products", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      alert(editingProduct ? "수정 완료!" : "등록 완료!");
      closeModal();
      fetchProducts();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ 등록/수정 실패:", err.response?.data || err.message);
        alert(
          "등록/수정 실패: " + (err.response?.data?.message || "서버 오류")
        );
      } else if (err instanceof Error) {
        console.error("❌ 예외 발생:", err.message);
        alert("알 수 없는 오류가 발생했습니다.");
      } else {
        console.error("❌ 알 수 없는 에러", err);
        alert("등록/수정 실패에 실패했습니다.");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("삭제 완료!");
      fetchProducts();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("❌ 삭제 실패:", err.response?.data || err.message);
        alert("삭제 실패: " + (err.response?.data?.message || "서버 오류"));
      } else if (err instanceof Error) {
        console.error("❌ 예외 발생:", err.message);
        alert("알 수 없는 오류가 발생했습니다.");
      } else {
        console.error("❌ 알 수 없는 에러", err);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: "", description: "", price: "", stock: "" });
    setEditingProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">상품 목록</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 상품 등록
        </button>
      </div>

      {/* 등록/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? "상품 수정" : "상품 등록"}
            </h2>

            <input
              type="text"
              placeholder="상품명"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <textarea
              placeholder="설명"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />
            <input
              type="number"
              placeholder="가격"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border p-2 mb-2"
            />
            <input
              type="number"
              placeholder="재고"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 상품 테이블 */}
      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">이름</th>
            <th className="border px-4 py-2">가격</th>
            <th className="border px-4 py-2">재고</th>
            <th className="border px-4 py-2">등록일</th>
            <th className="border px-4 py-2">작업</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.id}</td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.price.toLocaleString()}원</td>
              <td className="border px-4 py-2">{p.stock}</td>
              <td className="border px-4 py-2">
                {new Date(p.created_at).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 underline mr-2"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 underline"
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
