"use client";
import { states } from "@/app/dashboard/vehicles/register/data";
import { CookieType } from "@/cookieType";
import { setCookieValue } from "@/utils";
import { Button, Col, Flex, Form, Input, Row, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BusinessInformation() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [selectedState, setSelectedState] =
    useState<keyof typeof states>("Abia");

  const onFinish = (values: IVehicleInfo) => {
    setCookieValue(CookieType.BusinessInformation, values);
    router.push("/dashboard/shop-allocations/create/emergency-information");
  };
  useEffect(() => {
    // const initialValue = getCookieValue<IEmploymentInformation>(
    //   CookieType.BusinessInformation
    // );
    // if (initialValue) {
    //   form.setFieldsValue(initialValue);
    // }
  }, [form]);
  return (
    <Flex style={{ padding: 24, flex: 1 }}>
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600, width: "100%" }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="employmentStatus"
              label="Employment Status"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="status"
                allowClear
                options={[
                  { label: "Self employed", value: "SelfEmployed" },
                  { label: "Employed", value: "Employee" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="currentEmployer"
              label="Current Employer"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Current Employer Name" />
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
