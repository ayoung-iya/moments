import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ToastContainer from "@/components/toastContainer";
import { ToastProvider } from "@/context/toastContext";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moments",
  description: "당신의 이야기를 기록하는 공간",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} mx-auto min-w-80 max-w-screen-lg antialiased`}>
        <ToastProvider>
          <Suspense>
            <div id="modal" />
            {modal}
            {children}
            <ToastContainer />
          </Suspense>
        </ToastProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
