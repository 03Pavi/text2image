
import type { Metadata } from "next";
import StoreProvider from "@/shared/providers/store-provider";
import Header from "@/shared/ui/header";
import { Orbitron  } from "next/font/google";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Artistry.AI",
  description: "Text to image with AI Art Generator",
  icons: {
    icon: "/favicon.ico",
  },
};

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700','600','500'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={orbitron.className}>
      <body suppressHydrationWarning={true}>
        <StoreProvider>
          <Header />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
