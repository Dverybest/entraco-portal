"use client";
import { Flex, Typography } from "antd";
import { ReactNode } from "react";
const { Title, Text } = Typography;

export const PageHeader = ({
  title,
  subTitle,
  cta,
}: {
  title: string;
  subTitle: string;
  cta: ReactNode;
}) => {
  return (
    <Flex style={{ paddingBottom: 24 }} justify={"space-between"}>
      <Flex vertical>
        <Title style={{ marginBottom: 0 }}>{title}</Title>
        <Text>{subTitle}</Text>
      </Flex>
      {cta}
    </Flex>
  );
};
