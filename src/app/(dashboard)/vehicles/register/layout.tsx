"use client";
import { PageHeader } from "@/components";
import { CookieType } from "@/cookieType";
import { useFormSequenceGuard } from "@/hooks/useFormSequenceGuard";
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
    "/vehicles/register": {
      step: 0,
      crumb: "Vehicle Information",
      cookieDependency: null,
    },
    "/vehicles/register/owner-information": {
      step: 1,
      crumb: "Owner Information",
      cookieDependency: CookieType.VehicleInformation,
    },
    "/vehicles/register/driver-information": {
      step: 2,
      crumb: "Driver Information",
      cookieDependency: CookieType.BusinessInformation,
    },
    "/vehicles/register/route-assignment": {
      step: 3,
      crumb: "Route Assignment",
      cookieDependency: CookieType.DriverInformation,
    },
  };

  useFormSequenceGuard(
    mapActive[pathname as keyof typeof mapActive]?.cookieDependency
  );

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
          overflow: "hidden",
          flexDirection: "column",
        }}
      >
        <Steps
          style={{
            alignSelf: "flex-start",
            marginTop: "16px",
            marginBottom: "16px",
          }}
          size={"small"}
          direction={"horizontal"}
          current={mapActive[pathname as keyof typeof mapActive]?.step ?? 0}
          items={[
            {
              title: "Vehicle Information",
            },
            {
              title: "Owner Information",
            },
            {
              title: "Driver Information",
            },
            {
              title: "Route Assignment",
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
