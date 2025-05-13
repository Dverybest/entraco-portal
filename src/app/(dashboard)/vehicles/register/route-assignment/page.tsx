"use client";
import dynamic from "next/dynamic";

const ShopInformation = dynamic(
  () => import("./shop-information").then((mod) => mod.ShopInformation),
  {
    ssr: false, // This ensures the component is not SSR'd
  }
);
export default function ShopInformationPage() {
  return <ShopInformation />;
}
