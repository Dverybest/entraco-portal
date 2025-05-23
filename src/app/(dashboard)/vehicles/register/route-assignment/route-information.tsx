"use client";

import { useFormData } from "@/hooks/useFormData";
import { useRegisterVehicleMutation } from "@/hooks/api/useRegisterVehicleMutation";
import { Form, Select, Button, Flex, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { states } from "../data";

export default function RouteInformation() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { vehicleInfo, ownerInfo, driverInfo } = useFormData();
  const registerVehicle = useRegisterVehicleMutation();

  useEffect(() => {
    if (!vehicleInfo || !ownerInfo || !driverInfo) {
      router.push("/vehicles/register");
    }
  }, [vehicleInfo, ownerInfo, driverInfo, router]);

  const onFinish = (values: { route: string; routeState: string }) => {
    if (!vehicleInfo || !ownerInfo || !driverInfo)  return;
    registerVehicle.mutate({
      ...values,
      vehicleInfo,
      ownerInfo,
      driverInfo,
    });
  };

  return (
    <Flex vertical gap={24}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          label="Route"
          name="route"
          rules={[{ required: true, message: "Please enter the route" }]}
        >
          <Select
            placeholder="Select route"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { label: "Interstate", value: "is" },
              { label: "TownState", value: "ts" },
              { label: "Internal Local Government", value: "il" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="State"
          name="routeState"
          rules={[{ required: true, message: "Please select the state" }]}
        >
          <Select
            placeholder="Select state"
            options={Object.keys(states).map((state) => ({
              label: state,
              value: state,
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={registerVehicle.isPending}
            >
              Register Vehicle
            </Button>
            <Button onClick={() => router.back()}>Back</Button>
          </Space>
        </Form.Item>
      </Form>
    </Flex>
  );
}
