"use client";
import { SessionProvider } from "next-auth/react";

export const Provider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SessionProvider>{children}</SessionProvider>;
};
