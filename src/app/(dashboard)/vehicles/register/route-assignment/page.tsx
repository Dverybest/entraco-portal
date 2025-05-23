"use client";
import dynamic from "next/dynamic";
import { Spin } from "antd";

const RouteInformation = dynamic(() => import("./route-information"), {
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      <Spin size="large" />
    </div>
  ),
  ssr: false,
});

export default function RouteInformationPage() {
  return <RouteInformation />;
}
