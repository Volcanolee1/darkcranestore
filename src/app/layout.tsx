import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DarkcraneStore - 霓虹拼车局",
  description: "赛博朋克风格 VPS 拼车平台。精品线路，按位出发，随上随走。",
  generator: "v0.app",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="bg-black">
      <body className="bg-black font-sans antialiased">{children}</body>
    </html>
  );
}
