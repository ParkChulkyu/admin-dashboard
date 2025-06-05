// app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MyShop 쇼핑몰",
  description: "Next.js + Laravel 기반의 쇼핑 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ 사용자 헤더 */}
        <header className="bg-gray-900 text-white px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">
              🛒 MyShop
            </Link>
            <nav className="space-x-4">
              <Link href="/cart">장바구니</Link>
              <Link href="/orders">주문내역</Link>
              <Link href="/login">로그인</Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto py-6 px-4">{children}</main>
      </body>
    </html>
  );
}
