'use client';

import {
  Card,
  Typography,
  Row,
  Col,
  Divider,
  Image,
  Spin,
  Alert,
  Button,
  Space,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React from "react";
import { useGetSingleVehicleQuery } from "@/hooks/api/useGetSingleVehicleQuery";

const { Title, Text } = Typography;

export default function ScannedVehiclePage() {
  const params = useParams();
  const vehicleId = params?.id as string;
  const router = useRouter();

  const { data, isLoading, error } = useGetSingleVehicleQuery(vehicleId);

  if (isLoading) {
    return <Spin style={{ display: "block", margin: "100px auto" }} />;
  }
  if (error) {
    return (
      <Alert
        type="error"
        message="Error loading vehicle details"
        description={error instanceof Error ? error.message : "Unknown error"}
        style={{ maxWidth: 600, margin: "100px auto" }}
      />
    );
  }
  const vehicle = data?.data;
  if (!vehicle) {
    return (
      <Alert
        type="warning"
        message="Vehicle not found"
        style={{ maxWidth: 600, margin: "100px auto" }}
      />
    );
  }
  const owner = vehicle.owner || {};
  const driver = vehicle.driver || {};
  const route = vehicle.route || {};

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 800,
          margin: "0 auto 16px auto",
        }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
      </div>
      <Card
        style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: 8,
          boxShadow: "0 2px 8px #f0f1f2",
        }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Row align="middle" gutter={8}>
              <Col>
                <Image
                  src="/entraco-logo.jpeg"
                  alt="ENTRACO Logo"
                  width={60}
                  preview={false}
                />
              </Col>
              <Col>
                <Title level={4} style={{ margin: 0 }}>
                  ENUGU STATE TRANSPORT COMPANY
                </Title>
                <Text
                  type="secondary"
                  style={{ fontWeight: 600, color: "#2C2C2C" }}>
                  Vehicle Details
                </Text>
              </Col>
            </Row>
          </Col>
          <Col style={{ textAlign: "right" }}>
            <Text strong>Registration No</Text>
            <br />
            <Text>{route.registrationNo || vehicle.registrationNumber}</Text>
          </Col>
        </Row>
        <Divider />
        {/* VEHICLE INFORMATION */}
        <Divider
          orientation="center"
          style={{ background: "#E7FCFF", padding: "10px 0" }}>
          <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>
            VEHICLE INFORMATION
          </Text>
        </Divider>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Registration Number:</Text>
            <span>{vehicle.registrationNumber}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Chassis Number (VIN):</Text>
            <span>{vehicle.chassisNumber}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Engine Number:</Text>
            <span>{vehicle.engineNumber}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Vehicle Make:</Text>
            <span>{vehicle.make}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Year of Manufacture:</Text>
            <span>{vehicle.yearOfManufacture}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Vehicle Type:</Text>
            <span>{vehicle.type}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Capacity (Number of Passengers):</Text>
            <span>{vehicle.capacity}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Fuel Type:</Text>
            <span>{vehicle.fuelType}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Plate Number Issuing State:</Text>
            <span>{vehicle.issuingState}</span>
          </div>
        </div>
        {/* DRIVER INFORMATION */}
        <Divider
          orientation="center"
          style={{ background: "#E7FCFF", padding: "10px 0" }}>
          <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>
            DRIVER INFORMATION
          </Text>
        </Divider>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Full Name:</Text>
            <span>{driver.fullName}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Phone Number:</Text>
            <span>{driver.phoneNumber}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>License Number:</Text>
            <span>{driver.licenseNumber}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>License Class:</Text>
            <span>{driver.licenseClass}</span>
          </div>
        </div>
        {/* ROUTE INFORMATION */}
        <Divider
          orientation="center"
          style={{ background: "#E7FCFF", padding: "10px 0" }}>
          <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>
            ROUTE INFORMATION
          </Text>
        </Divider>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>Route:</Text>
            <span>{route.route}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}>
            <Text strong>State:</Text>
            <span>{route.state}</span>
          </div>
        </div>
      </Card>
    </div>
  );
} 