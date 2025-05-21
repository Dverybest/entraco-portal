"use client";
import { CookieType } from "@/cookieType";
import { getCookieValue, setCookieValue } from "@/utils";
import { fetcher } from "@/utils/fetcher";
import { Button, Flex, Form, Select, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo} from "react";
import { states } from "../data";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";

type ApiError = {
  statusCode: number;
  message: string;
};

type RegisterResponse = {
  success: boolean;
  data: {
    paymentUrl: string;
  };
};

const cleanVehicleInfo = (vehicleInfo: IVehicleInfo) => {
  return {
    ...vehicleInfo,
    yearOfManufacture: dayjs(vehicleInfo.yearOfManufacture).format('YYYY'),
    vehiclePhotoUrl: vehicleInfo.pictureUrl,
  };
};

const cleanOwnerInfo = (ownerInfo: IOwnerInfo) => {
  const { pictureUrl, ...rest } = ownerInfo;
  return {
    ...rest,
    idDocumentUrl: pictureUrl || ownerInfo.idDocumentUrl,
  };
};

const cleanDriverInfo = (driverInfo: IDriverInformation) => {
  return {
    ...driverInfo,
    gender: driverInfo.gender as "Male" | "Female",
    licenseClass: driverInfo.licenseClass as "A" | "B" | "C" | "D" | "E" | "F",
    issuingAuthority: driverInfo.issuingAuthority as "FRSC" | "State VIO",
  };
};

export const RouteInformation = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const { vehicleInfo, ownerInfo, driverInfo } = useMemo(() => {
    const vehicleInfo = getCookieValue<IVehicleInfo>(CookieType.VehicleInformation);
    const ownerInfo = getCookieValue<IOwnerInfo>(CookieType.OwnerInformation);
    const driverInfo = getCookieValue<IDriverInformation>(CookieType.DriverInformation);
    return {
      vehicleInfo,
      ownerInfo,
      driverInfo,
    };
  }, []);

  const registerVehicle = useMutation({
    mutationFn: (values: { route: string; routeState: string }) => {
      if (!vehicleInfo || !ownerInfo || !driverInfo) {
        throw new Error('Missing required information');
      }

      const payload = {
        vehicleInfo: cleanVehicleInfo(vehicleInfo),
        ownerInfo: cleanOwnerInfo(ownerInfo),
        driverInfo: cleanDriverInfo(driverInfo),
        routeInfo: {
          routeCode: values.route.toUpperCase(),
          state: values.routeState,
        },
      };

      return fetcher<RegisterResponse>({
        url: '/api/vehicles/register',
        method: 'POST',
        data: payload,
      });
    },
    onSuccess: (response) => {
      if (response.success && response.data.paymentUrl) {
        // Clear all cookies after successful registration
        Object.values(CookieType).forEach((cookieType) => {
          setCookieValue(cookieType, '');
        });
        window.open(response.data.paymentUrl, '_self');
 
      } else {
        message.error('Registration successful but payment URL not received');
      }
    },
    onError: (error: ApiError) => {
      message.error(error.message || 'Failed to register vehicle. Please try again.');
      console.error('Registration error:', error);
    },
  });

  const onFinish = (values: { route: string; routeState: string }) => {
    registerVehicle.mutate(values);
  };

  useEffect(() => {
    const initialValue = getCookieValue<{ route: string; routeState: string }>(
      CookieType.DriverInformation
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
          rules={[{ required: true, message: 'Please select a route' }]}
        >
          <Select
            placeholder={"Select route"}
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
          name="routeState"
          label="Assign Route State"
          rules={[{ required: true, message: 'Please select a state' }]}
        >
          <Select
            placeholder="Select state"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
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
              <Button loading={registerVehicle.isPending} type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
      {/* {isModalOpen && (
        <AllocationSuccessModal
          isOpen={isModalOpen}
          closeModal={() => {
            setIsModalOpen(false);
            router.push('/vehicles'); // Redirect to vehicles list after success
          }}
          onPaymentClick={handlePayment}
        />
      )} */}
    </Flex>
  );
};
