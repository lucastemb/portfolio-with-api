import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Head from "next/head";


const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: "--font-grotesk"
})

export const metadata: Metadata = {
  title: "Lucas Tembras",
  description: "Lucas Tembras's portfolio site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.5/src/app/ci.min.css"
  />
      </Head>
      <body className={`${spaceGrotesk.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
