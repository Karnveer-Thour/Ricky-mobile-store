import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/store/providers";
import Alert from "@/components/alert";

export const metadata: Metadata = {
  title: "Store Management System",
  description: "Ricky Mobile Store Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <Alert />
          {children}
        </Providers>
      </body>
    </html>
  );
}
