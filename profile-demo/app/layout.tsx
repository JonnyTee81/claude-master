import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "User Profile Prototype",
  description: "Interactive user profile page with multiple states",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
