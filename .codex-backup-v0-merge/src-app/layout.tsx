import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DarkcraneStore - 极速专线拼车平台",
  description:
    "赛博朋克风格的 VPS 拼车服务，支持精品专线、家宽出口和 USDT 支付。",
  keywords: ["VPS", "专线", "拼车", "家宽", "USDT"],
  authors: [{ name: "Darkcrane" }],
};

export const viewport: Viewport = {
  themeColor: "#070714",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col bg-[var(--color-dark-base)] text-[var(--color-text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
