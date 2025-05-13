"use client";
import { PageHeader } from "@/components";
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Empty, Spin, theme } from "antd";
import { use, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ViewAllocations = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <section
      style={{
        margin: "16px 16px 0px",
        padding: "24px",
        minHeight: "100%",
        background: colorBgContainer,
      }}
    >
      <PageHeader
        title="Shop Allocation Letter"
        subTitle={id}
        cta={
          <Button
            type={"primary"}
            variant={"solid"}
            onClick={() => reactToPrintFn()}
            icon={<PrinterOutlined />}
          >
            Print
          </Button>
        }
      />
      <Spin spinning={false}>
        {false ? (
          <div
            ref={contentRef}
            style={{ margin: 24, border: "1px solid #eee" }}
          >
            {/* <AllocationLetter data={data.data} /> */}
          </div>
        ) : (
          <Empty description={false} />
        )}
      </Spin>
    </section>
  );
};

export default ViewAllocations;
