"use client";
import { PageHeader } from "@/components";
import { Layout, Steps, theme } from "antd";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
const { Content } = Layout;

export default function CreateAllocation({
  children,
}: Readonly<{ children: ReactNode }>) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const pathname = usePathname();
  const mapActive = {
    "/dashboard/shop-allocations/create": {
      step: 0,
      crumb: "Applicant Information",
    },
    "/dashboard/vehicles/register/owner-information": {
      step: 1,
      crumb: "Business Information",
    },
    "/dashboard/shop-allocations/create/emergency-information": {
      step: 2,
      crumb: "Emergency Information",
    },
    "/dashboard/shop-allocations/create/shop-information": {
      step: 3,
      crumb: "Shop Information",
    },
  };
  return (
    <Layout
      style={{
        margin: "16px 16px 0px",
        padding: "24px",
        background: colorBgContainer,
        height: "100%",
      }}
    >
      <PageHeader
        title="Vehicle Registration Form"
        subTitle="Enter the details below to register a new vehicle"
        cta={null}
      />
      <Content
        style={{
          display: "flex",
          // overflow: "hidden",
          // flexDirection: "column",
        }}
      >
        <Steps
          style={{ flex: 0.3, alignSelf: "flex-start", marginTop: "38px" }}
          size={"small"}
          direction="vertical"
          current={mapActive[pathname as keyof typeof mapActive]?.step ?? 0}
          items={[
            {
              title: "Vehicle Information",
            },
            {
              title: "Owner Information",
            },
            {
              title: "Emergency Information",
            },
            {
              title: "Shop  Information",
            },
          ]}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            height: "99%",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}
