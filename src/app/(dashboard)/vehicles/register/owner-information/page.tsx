"use client";
import { states } from "@/app/(dashboard)/vehicles/register/data";
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
  UploadFile,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { RcFile } from "antd/es/upload";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { UploadRequestOption } from "rc-upload/lib/interface";
import { useEffect, useState } from "react";

export default function OwnerInformation() {
  const [fileList, setFileList] = useState<UploadFile[]>();
  const [form] = Form.useForm();
  const router = useRouter();
  const [selectedState, setSelectedState] =
    useState<keyof typeof states>("Abia");

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

  const onFinish = (values: IOwnerInfo) => {
    setCookieValue(CookieType.EmergencyInformation, values);
    router.push("/vehicles/register/route-assignment");
  };
  useEffect(() => {
    const initialValue = getCookieValue<IOwnerInfo>(
      CookieType.EmergencyInformation
    );
    if (initialValue) {
      form.setFieldsValue({
        ...initialValue,
        dateOfBirth: dayjs(initialValue.dateOfBirth),
      });
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
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter Name of Next of Kin" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Gender"
                allowClear
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true }]}
            >
              <Input type={"email"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="dateOfBirth"
              label="Date of birth"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} picker={"date"} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input type={"phone"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phoneNumber"
              label="Alternative Phone Number"
              rules={[{ required: false }]}
            >
              <Input type={"phone"} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="state"
              label="State of Origin"
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
            <Form.Item
              name="lga"
              label="Local Government Area"
              rules={[{ required: true }]}
            >
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
              label="Identification Type "
              rules={[{ required: true }]}
            >
              <Select
                allowClear
                options={[
                  { label: "National ID", value: "National ID" },
                  { label: "Driver’s License", value: "Driver’s License" },
                  { label: "Voter’s Card", value: "Voter’s Card" },
                  {
                    label: "International Passport",
                    value: "International Passport",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="idNumber"
              label="ID Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="city"
              label="Residential Address "
              rules={[{ required: true }]}
            >
              <TextArea />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="pictureUrl"
          label="Valid ID Document"
          rules={[
            {
              required: true,
              message: "Please upload a file!",
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
            accept={".jpg, .jpeg, .png, .pdf"}
            onRemove={onRemove}
            customRequest={customRequest}
          >
            <Button icon={<UploadOutlined />}>Upload Valid ID Document</Button>
          </Upload>
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
