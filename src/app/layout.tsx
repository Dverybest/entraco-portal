import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import { siteMetadata } from "./siteMetadata";

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dm-sans",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
  openGraph: {
    type: "website",
    images: [
      {
        url: siteMetadata.openGraphImage,
      },
    ],
  },
  twitter: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: ["/tranzakt.png"],
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.variable}>
        <ToastContainer position="top-right" theme="light" />
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
