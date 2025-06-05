// src/utils/orderApi.ts
import axios from "axios";

export async function submitOrder(
  items: { product_id: number; quantity: number }[]
) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("로그인이 필요합니다.");

  const res = await axios.post(
    "http://localhost:8000/api/orders",
    { items },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data; // { message, order_id }
}
