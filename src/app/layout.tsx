import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/Provider";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

export const metadata: Metadata = {
  title: "MutliCart",
  description: "E-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
          </StoreProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
