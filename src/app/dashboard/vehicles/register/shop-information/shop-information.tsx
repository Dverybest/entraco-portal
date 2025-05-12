"use client";
import { CookieType } from "@/cookieType";
import { getCookieValue, setCookieValue, useDebounceInput } from "@/utils";
import { Button, Col, Flex, Form, Input, Row, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AllocationSuccessModal } from "./allocation-success-modal";

export const ShopInformation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [searchMarket, setSearchMarket] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _search = useDebounceInput(searchMarket);

  const {} = useMemo(() => {
    const applicationInformation = getCookieValue<IVehicleInfo>(
      CookieType.VehicleInformation
    );
    return {
      applicationInformation,
    };
  }, []);

  const onFinish = (values: IVehicleInfo) => {
    setCookieValue(CookieType.ShopInformation, values);
  };
  const onSearch = (value: string) => {
    setSearchMarket(value);
  };

  useEffect(() => {
    const initialValue = getCookieValue<IVehicleInfo>(
      CookieType.ShopInformation
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
        style={{ maxWidth: 600, width: "100%" }}
      >
        <Form.Item name="marketId" label="Market" rules={[{ required: true }]}>
          <Select
            placeholder={"Select market"}
            allowClear
            showSearch
            filterOption={false}
            onSearch={onSearch}
            options={[]}
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name={"number"}
              label="Shop Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="line"
              label="Shop Line"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Shop Line" />
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
              <Button loading={true} type="primary" htmlType="submit">
                Next
              </Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
      {isModalOpen && (
        <AllocationSuccessModal
          isOpen={isModalOpen}
          closeModal={() => setIsModalOpen(false)}
        />
      )}
    </Flex>
  );
};
