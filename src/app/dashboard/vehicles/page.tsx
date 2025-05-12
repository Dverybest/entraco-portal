"use client";
import { PageHeader } from "@/components";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  GetProps,
  Input,
  Select,
  Space,
  Spin,
  Table,
  theme,
} from "antd";
import Link from "next/link";
type SearchProps = GetProps<typeof Input.Search>;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const dataSource: [] = [];

  const columns = [
    {
      title: "S/N",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "NAME OF MARKET",
      dataIndex: "market",
      key: "market",
    },
    {
      title: "OWNER’S NAME",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "SHOP NUMBER",
      dataIndex: "shopNumber",
      key: "shopNumber",
    },
    {
      title: "SHOP LINE",
      dataIndex: "shopLine",
      key: "shopLine",
    },
    {
      title: "PHONE NUMBER",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "DATE",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      render: ({ id }: { id: string }) => {
        return (
          <Space size="middle">
            <Link href={`/dashboard/shop-allocations/${id}`}>View</Link>
          </Space>
        );
      },
    },
  ];

  const onOk = (
    value: DatePickerProps["value"] | RangePickerProps["value"]
  ) => {
    console.log("onOk: ", value);
  };
  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
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
        title="Vehicles"
        subTitle="List of Registered Vehicles"
        cta={
          <Button
            type={"primary"}
            variant={"solid"}
            href="/dashboard/vehicles/register"
            icon={<PlusOutlined />}
          >
            Register New Vehicles
          </Button>
        }
      />
      <Flex
        justify={"flex-end"}
        align={"flex-end"}
        gap={10}
        style={{ paddingBottom: 16 }}
      >
        <Select placeholder={"Filter by market"} allowClear options={[]} />
        <RangePicker
          format="YYYY-MM-DD"
          onChange={(value, dateString) => {
            console.log("Selected Time: ", value);
            console.log("Formatted Selected Time: ", dateString);
          }}
          onOk={onOk}
        />
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: 200 }}
        />
      </Flex>
      <Spin spinning={false}>
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            total: 0,
            pageSize: 1,
          }}
        />
      </Spin>
    </section>
  );
}
