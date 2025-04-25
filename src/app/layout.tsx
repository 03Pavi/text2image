
import type { Metadata } from "next";
import StoreProvider from "@/shared/providers/store-provider";
import "./globals.scss";
import Header from "@/shared/ui/header";

export const metadata: Metadata = {
  title: "Next project",
  description: "A Sample Next.js project with scalable modular structure",
  icons: {
    icon: "/app-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <Header />{children}</StoreProvider>
      </body>
    </html>
  );
}
