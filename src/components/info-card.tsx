import { Flex, Typography } from "antd";
import Image from "next/image";
import { FC } from "react";
const { Title, Text } = Typography;
export const InfoCard: FC<{
  title: string;
  value: number;
  color: string;
  textColor?: string;
}> = ({ title, value, color, textColor }) => {
  return (
    <Flex
      style={{
        height: 120,
        padding: 24,
        backgroundColor: color,
        borderRadius: 15,
      }}
      justify={"space-between"}
      vertical
      flex={1}
    >
      <Image src={"/bar.svg"} alt="bar" width={34} height={12} />
      <Flex vertical>
        <Title level={5} style={{ color: textColor }}>
          {title}
        </Title>
        <Text style={{ color: textColor }}>{value} </Text>
      </Flex>
    </Flex>
  );
};
