"use client";
import { CookieType } from "@/cookieType";
import { cloudinaryUpload, getCookieValue, setCookieValue } from "@/utils";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { useEffect, useState } from "react";
import { states } from "./data";

export default function CreateAllocation() {
  const router = useRouter();
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [form] = Form.useForm();
  const setPreviewImage = (imageUrl: string) => {
    const nameSplit = imageUrl.split("/");
    setFileList([
      {
        uid: "-1",
        name: nameSplit[nameSplit.length - 1],
        status: "done",
        url: imageUrl,
      },
    ]);
  };
  const onFinish = (values: IVehicleInfo) => {
    setCookieValue(CookieType.VehicleInformation, values);
    router.push("/dashboard/vehicles/register/owner-information");
  };

  useEffect(() => {
    const initialValue = getCookieValue<IVehicleInfo>(
      CookieType.VehicleInformation
    );

    if (initialValue?.pictureUrl) {
      setPreviewImage(initialValue.pictureUrl);
      form.setFieldsValue({
        ...initialValue,
        yearOfManufacture: dayjs(`${initialValue.yearOfManufacture}`, "YYYY"),
      });
    }
  }, [form]);

  const customRequest = ({ onSuccess, onError, file }: UploadRequestOption) => {
    cloudinaryUpload(file as RcFile)
      .then((res) => {
        onSuccess?.(res, file);
        setPreviewImage(res.secure_url);
      })
      .catch((err) => {
        onError?.(err);
      });
  };

  const onRemove = () => {
    setFileList([]);
  };

  return (
    <Flex style={{ padding: 24 }}>
      <Form
        layout="vertical"
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ width: "100%", maxWidth: 600 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="registrationNumber"
              label="Vehicle Registration Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="(e.g., ENU123AB)" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Vehicle Type"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Vehicle Type"
                allowClear
                options={[
                  { label: "Bus", value: "Bus" },
                  { label: "Mini Bus", value: "Mini Bus" },
                  { label: "Taxi", value: "BTaxius" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="chassisNumber"
              label="Chassis Number (VIN)"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="engineNumber"
              label="Engine Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="make"
              label="Vehicle Make"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Vehicle Make"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={["Toyota", "Mercedes"].map((state) => ({
                  label: state,
                  value: state,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="fuelType"
              label="Fuel Type"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select Fuel Type"
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={["Petrol", "Diesel", "CNG", "Electric"].map(
                  (type) => ({
                    label: type,
                    value: type,
                  })
                )}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="issuingState"
              label="Plate Number Issuing State"
              rules={[{ required: true }]}
            >
              <Select
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
          </Col>
          <Col span={12}>
            <Form.Item
              name="capacity"
              label="Capacity (Number of Passengers) "
              rules={[{ required: true }]}
            >
              <Input type={"number"} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="model"
              label="Vehicle Model"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="yearOfManufacture"
              label="Year of Manufacture"
              rules={[{ required: true }]}
            >
              <DatePicker
                format={"YYYY"}
                style={{ width: "100%" }}
                picker="year"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="pictureUrl"
          label="Recent Vehicle Photo"
          rules={[
            {
              required: true,
              message: "Please upload an image!",
            },
          ]}
        >
          <Upload
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={fileList}
            onChange={(info) => {
              const { file, fileList } = info;
              if (file.status === "done" && file.response) {
                const url = file.response.secure_url;
                form.setFieldValue("pictureUrl", url);
              } else if (file.status === "removed") {
                form.setFieldValue("pictureUrl", undefined);
              }
              setFileList(fileList);
            }}
            accept={".jpg, .jpeg, .png"}
            onRemove={onRemove}
            customRequest={customRequest}
          >
            <Button icon={<UploadOutlined />}>
              Upload Recent Vehicle Photo
            </Button>
          </Upload>
        </Form.Item>
        <Flex justify={"flex-end"} align={"flex-end"}>
          <Form.Item>
            <Space>
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
