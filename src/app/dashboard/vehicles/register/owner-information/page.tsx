"use client";
import { states } from "@/app/dashboard/vehicles/register/data";
import { CookieType } from "@/cookieType";
import { getCookieValue, setCookieValue } from "@/utils";
import { Button, Col, Flex, Form, Input, Row, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmergencyInformation() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [selectedState, setSelectedState] =
    useState<keyof typeof states>("Abia");

  const onFinish = (values: IVehicleInfo) => {
    setCookieValue(CookieType.EmergencyInformation, values);
    router.push("/dashboard/shop-allocations/create/shop-information");
  };
  useEffect(() => {
    const initialValue = getCookieValue<IVehicleInfo>(
      CookieType.EmergencyInformation
    );
    if (initialValue) {
      form.setFieldsValue(initialValue);
    }
  }, [form]);
  return (
    <Flex style={{ padding: 24, flex: 1 }}>
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ width: 600 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Name of Next of Kin"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Name of Next of Kin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="relationship"
              label="Relationship"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Relationship" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="email" label="Email" rules={[{ required: true }]}>
              <Input placeholder="Enter Mail" type={"email"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Number" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="state" label="State" rules={[{ required: true }]}>
              <Select
                placeholder="Select state"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => {
                  setSelectedState(value);
                  form.setFieldsValue({ lga: "" });
                }}
                options={Object.keys(states).map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lga" label="L.G.A" rules={[{ required: true }]}>
              <Select
                placeholder="Select LGA"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={states[selectedState]?.map((lga) => ({
                  label: lga,
                  value: lga,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="zipCode"
              label="Zip Code"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="town" label="Town" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Flex justify={"flex-end"} align={"flex-end"}>
          <Form.Item>
            <Space>
              <Button
                onClick={() => {
                  router.back();
                }}
                type={"default"}
                variant={"outlined"}
                htmlType={"button"}
              >
                Previous
              </Button>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </Flex>
  );
}
