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




export default function DriverInformation() {
  const [idFileList, setIdFileList] = useState<UploadFile[]>();
  const [licenseFileList, setLicenseFileList] = useState<UploadFile[]>();
  const [passportFileList, setPassportFileList] = useState<UploadFile[]>();
  const [form] = Form.useForm();
  const router = useRouter();
  const [selectedState, setSelectedState] =
    useState<keyof typeof states>("Abia");

  const setPreviewImage = (imageUrl: string, setFileListFunc: React.Dispatch<React.SetStateAction<UploadFile[] | undefined>>) => {
    const nameSplit = imageUrl.split("/");
    setFileListFunc([
      {
        uid: "-1",
        name: nameSplit[nameSplit.length - 1],
        status: "done",
        url: imageUrl,
      },
    ]);
  };

  const customRequest = (
    { onSuccess, onError, file }: UploadRequestOption,
    fieldName: string,
    setFileListFunc: React.Dispatch<React.SetStateAction<UploadFile[] | undefined>>
  ) => {
    cloudinaryUpload(file as RcFile)
      .then((res) => {
        onSuccess?.(res, file);
        setPreviewImage(res.secure_url, setFileListFunc);
        form.setFieldValue(fieldName, res.secure_url);
      })
      .catch((err) => {
        onError?.(err);
      });
  };

  const onRemove = (
    fieldName: string,
    setFileListFunc: React.Dispatch<React.SetStateAction<UploadFile[] | undefined>>
  ) => {
    setFileListFunc([]);
    form.setFieldValue(fieldName, undefined);
  };

  const onFinish = (values: IDriverInformation) => {
    // Convert Date objects to ISO strings for storage
    const formattedValues = {
      ...values,
      dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).toISOString() : undefined,
      issueDate: values.issueDate ? dayjs(values.issueDate).toISOString() : undefined,
      expiryDate: values.expiryDate ? dayjs(values.expiryDate).toISOString() : undefined,
    };
    
    setCookieValue(CookieType.DriverInformation, formattedValues);
    router.push("/vehicles/register/route-assignment");
  };
  
  useEffect(() => {
    const initialValue = getCookieValue<IDriverInformation>(
      CookieType.DriverInformation
    );
    if (initialValue) {
      form.setFieldsValue({
        ...initialValue,
        dateOfBirth: initialValue.dateOfBirth ? dayjs(initialValue.dateOfBirth) : undefined,
        issueDate: initialValue.issueDate ? dayjs(initialValue.issueDate) : undefined,
        expiryDate: initialValue.expiryDate ? dayjs(initialValue.expiryDate) : undefined,
      });
      
      if (initialValue.validIdUrl) {
        setPreviewImage(initialValue.validIdUrl, setIdFileList);
      }
      
      if (initialValue.licenseUrl) {
        setPreviewImage(initialValue.licenseUrl, setLicenseFileList);
      }
      
      if (initialValue.passportUrl) {
        setPreviewImage(initialValue.passportUrl, setPassportFileList);
      }
    }
  }, [form]);
  
  return (
    <Flex style={{ padding: 24, flex: 1 }}>
      <Form
        layout="vertical"
        form={form}
        name="driver-information"
        onFinish={onFinish}
        style={{ width: 600 }}
      >
        <h2>Personal Information</h2>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="fullName"
              label="Full Name (as on valid ID)"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} picker={"date"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select gender"
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="nationality"
              label="Nationality"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your nationality" />
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
          <Col span={24}>
            <Form.Item
              name="residentialAddress"
              label="Residential Address"
              rules={[{ required: true }]}
            >
              <TextArea placeholder="Enter your residential address" />
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
              <Input type="tel" placeholder="Enter your phone number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[{ required: true, type: "email" }]}
            >
              <Input type="email" placeholder="Enter your email address" />
            </Form.Item>
          </Col>
        </Row>

        <h2>Identification and Verification</h2>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="nin"
              label="National Identification Number (NIN)"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your NIN" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="validIdUrl"
          label="Upload Valid ID (e.g., NIN Slip, Driver's License, Voter's Card)"
          rules={[{ required: true, message: "Please upload a valid ID document" }]}
        >
          <Upload
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={idFileList}
            onChange={(info) => {
              setIdFileList(info.fileList);
            }}
            accept={".jpg, .jpeg, .png, .pdf"}
            onRemove={() => onRemove("validIdUrl", setIdFileList)}
            customRequest={(options) => customRequest(options, "validIdUrl", setIdFileList)}
          >
            <Button icon={<UploadOutlined />}>Upload Valid ID Document</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="passportUrl"
          label="Passport Photograph"
          rules={[{ required: true, message: "Please upload your passport photograph" }]}
        >
          <Upload
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={passportFileList}
            onChange={(info) => {
              setPassportFileList(info.fileList);
            }}
            accept={".jpg, .jpeg, .png"}
            onRemove={() => onRemove("passportUrl", setPassportFileList)}
            customRequest={(options) => customRequest(options, "passportUrl", setPassportFileList)}
          >
            <Button icon={<UploadOutlined />}>Upload Passport Photograph</Button>
          </Upload>
        </Form.Item>

        <h2>{`Driver's License Information`}</h2>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="licenseNumber"
              label="Driver's License Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter your driver's license number" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="licenseClass"
              label="Class of License"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select license class"
                options={[
                  { label: "A", value: "A" },
                  { label: "B", value: "B" },
                  { label: "C", value: "C" },
                  { label: "D", value: "D" },
                  { label: "E", value: "E" },
                  { label: "F", value: "F" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="issuingAuthority"
              label="Issuing Authority (FRSC/State VIO)"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Select issuing authority"
                options={[
                  { label: "FRSC", value: "FRSC" },
                  { label: "State VIO", value: "State VIO" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="issueDate"
              label="Date of Issue"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} picker={"date"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="expiryDate"
              label="Expiry Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} picker={"date"} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="licenseUrl"
          label="Upload Scanned Copy of Driver's License"
          rules={[{ required: true, message: "Please upload your driver's license" }]}
        >
          <Upload
            listType="picture"
            multiple={false}
            maxCount={1}
            fileList={licenseFileList}
            onChange={(info) => {
              setLicenseFileList(info.fileList);
            }}
            accept={".jpg, .jpeg, .png, .pdf"}
            onRemove={() => onRemove("licenseUrl", setLicenseFileList)}
            customRequest={(options) => customRequest(options, "licenseUrl", setLicenseFileList)}
          >
            <Button icon={<UploadOutlined />}>{`Upload Driver's License`}</Button>
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