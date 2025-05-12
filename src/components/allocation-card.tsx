import { Col, Descriptions, Row, Typography } from "antd";
import React from "react";
const { Title } = Typography;

interface AllocationCardProps {
  title: string;
  data: Record<string, string>;
}

export const AllocationCard: React.FC<AllocationCardProps> = ({
  title,
  data,
}) => {
  return (
    <main>
      <Title level={4} style={allocationCardTitle}>
        {title}
      </Title>
      <section style={allocationCardContent}>
        <Row gutter={[24, 24]}>
          {Object.entries(data).map((item, index) => {
            const [key, value] = item;
            return (
              <Col key={index} span={12}>
                <Descriptions>
                  <Descriptions.Item
                    label={key}
                    labelStyle={labelStyle}
                    contentStyle={contentStyle}
                  >
                    {value}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            );
          })}
        </Row>
      </section>
    </main>
  );
};

const allocationCardTitle: React.CSSProperties = {
  color: "#018B46",
};

const allocationCardContent: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "16px",
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "black",
  textTransform: "capitalize",
};

const contentStyle: React.CSSProperties = {
  fontWeight: 400,
  color: "black",
};
