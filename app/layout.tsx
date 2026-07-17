import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "친환경 수송 조건 설계소",
  description: "초등 5~6학년을 위한 친환경 수송 조건 설계 활동",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
