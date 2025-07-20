import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "4CL3 - Cloud Computing Course",
  description: "This is the project 1 of the 4CL3 Cloud Computing Course",
  generator: "Daniel Cho for Cloud Computing Course",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
