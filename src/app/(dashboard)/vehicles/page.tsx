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
      title: "Route number",
      dataIndex: "routeNumber",
      key: "routeNumber",
    },
    {
      title: "Vehicle Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Route Assignment ",
      dataIndex: "shopNumber",
      key: "shopNumber",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      render: ({ id }: { id: string }) => {
        return (
          <Space size="middle">
            <Link href={`/vehicles/${id}`}>View</Link>
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
            href="/vehicles/register"
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
        <Select
          placeholder="Filter byVehicle Type"
          allowClear
          options={[
            { label: "Bus", value: "Bus" },
            { label: "Mini Bus", value: "Mini Bus" },
            { label: "Taxi", value: "BTaxius" },
            { label: "Other", value: "Other" },
          ]}
        />
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
