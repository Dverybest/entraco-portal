import { Column } from "@ant-design/plots";

export const DemoDefaultTooltip = ({ markets }: { markets: [] }) => {
  const data = markets;

  const config = {
    data,
    xField: "name",
    yField: "numberOfShops",
    style: {
      fill: () => {
        return "#32C87D";
      },
    },
    label: {
      text: () => {
        return "";
      },
      offset: 10,
    },
    legend: false,
  };
  return <Column height={400} {...config} />;
};
