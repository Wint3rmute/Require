import type { Metadata } from "next";
import "./globals.css";
import ButtonAppBar from "../components/navbar";

export const metadata: Metadata = {
  title: "Require - System Modeling & Requirements Tracing",
  description: "System modeling and requirements tracing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ButtonAppBar />
        {children}
      </body>
    </html>
  );
}
