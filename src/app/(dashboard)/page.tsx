"use client";
import { InfoCard, PageHeader } from "@/components";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Spin, theme } from "antd";
import { DemoDefaultTooltip } from "./dashboard-chart";
import classes from "./style.module.css";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Spin spinning={false}>
      <section
        style={{
          margin: "16px 16px 0px",
          padding: "24px",
          background: colorBgContainer,
        }}
      >
        <PageHeader
          title="Dashboard"
          subTitle="Welcome to Enugu State Transport Company (ENTRACO) Registration Portal "
          cta={
            <Button
              type={"primary"}
              variant={"solid"}
              href="/vehicles/register"
              icon={<PlusOutlined />}
            >
              Register New Vehicle
            </Button>
          }
        />
        <Flex vertical gap={8} style={{ marginBottom: 28 }}>
          <Flex gap={8}>
            <InfoCard
              title="Total Registered Vehicle"
              color="#121C2D"
              textColor="white"
              value={0}
            />
            {/* <InfoCard title="Number of Markets" color="#FFFFD1" value={0} /> */}
            <InfoCard
              title="Number of  Vehicle Owners"
              color="#E7F6EC"
              value={0}
            />
            <div className={classes.decCard}>
              <p>
                Enugu State Transport Company (ENTRACO) Registration Made Easy
              </p>
            </div>
          </Flex>
        </Flex>
        <DemoDefaultTooltip markets={[]} />
      </section>
    </Spin>
  );
}
