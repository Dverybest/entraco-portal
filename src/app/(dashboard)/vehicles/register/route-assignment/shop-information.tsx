"use client";
import { CookieType } from "@/cookieType";
import { getCookieValue, setCookieValue, useDebounceInput } from "@/utils";
import { Button, Flex, Form, Select, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AllocationSuccessModal } from "./allocation-success-modal";
import { states } from "../data";

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
        <Form.Item
          name="route"
          label="Assign Route"
          rules={[{ required: true }]}
        >
          <Select
            placeholder={"Select route"}
            allowClear
            showSearch
            filterOption={false}
            onSearch={onSearch}
            options={[
              { label: "Interstate", value: "is" },
              { label: "TownState", value: "ts" },
              { label: "Internal Local Government", value: "il" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="routeState"
          label="Assign Route State"
          rules={[{ required: true }]}
        >
              <Select
                placeholder="Select state"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
       
                options={Object.keys(states).map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
        </Form.Item>


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
              <Button loading={false} type="primary" htmlType="submit">
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
