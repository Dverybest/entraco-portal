"use client";
import { PageHeader } from "@/components";
import { PlusOutlined, MoreOutlined, QrcodeOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Flex,
  GetProps,
  Input,
  Select,
  Spin,
  Table,
  theme,
  Alert,
  Dropdown,
  Menu,
} from "antd";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { QRCodeModal } from "./payment-successful/qr-code-modal";
import { useState } from "react";

type SearchProps = GetProps<typeof Input.Search>;
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { Search } = Input;
const { RangePicker } = DatePicker;

type VehicleListItem = {
  _id: string;
  registrationNumber: string;
  type: string;
  owner: { name: string; phoneNumber: string };
  route: { route: string };
  createdAt: string;
};

const useGetVehiclesQuery = () => {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: () =>
      fetcher<{ success: boolean; data: VehicleListItem[] }>({
        url: "/api/vehicles",
        method: "GET",
      }),
  });
};

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { data, isLoading, error } = useGetVehiclesQuery();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedVehicleUrl, setSelectedVehicleUrl] = useState("");

  const vehicles = data?.data || [];

  const dataSource = vehicles.map((v, idx) => ({
    key: idx + 1,
    id: v._id,
    routeNumber: v.registrationNumber,
    type: v.type,
    ownerName: v.owner?.name,
    shopNumber: v.route?.route,
    phoneNumber: v.owner?.phoneNumber,
    date: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "",
  }));

  const router = useRouter();

  const handleQRCodeClick = (vehicleId: string) => {
    const url = `${window.location.origin}/vehicles/${vehicleId}`;
    setSelectedVehicleUrl(url);
    setIsQRModalOpen(true);
  };

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
        const menu = (
          <Menu>
            <Menu.Item key="view" onClick={() => router.push(`/vehicles/${id}`)}>
              View
            </Menu.Item>
            <Menu.Item key="qr" onClick={() => handleQRCodeClick(id)}>
              <QrcodeOutlined /> QR Code
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
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
      {isLoading ? (
        <Spin spinning={true} style={{ display: "block", margin: "100px auto" }} />
      ) : error ? (
        <Alert type="error" message="Error loading vehicles" description={error instanceof Error ? error.message : "Unknown error"} style={{ maxWidth: 600, margin: "100px auto" }} />
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={{
            total: vehicles.length,
            pageSize: 10,
          }}
        />
      )}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        vehicleUrl={selectedVehicleUrl}
        title="Vehicle Details QR Code"
      />
    </section>
  );
}
