// app/admin/layout.tsx
import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6">
      <nav className="flex gap-4 mb-6">
        <Link href="/admin/dashboard">📊 대시보드</Link>
        <Link href="/admin/products">📦 상품관리</Link>
        <Link href="/admin/orders">🧾 주문관리</Link>
        <Link href="/admin/users">👥 회원관리</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}
