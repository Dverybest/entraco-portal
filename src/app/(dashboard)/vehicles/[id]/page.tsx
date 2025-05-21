"use client";
import { Card, Typography, Row, Col, Divider, Image, Spin, Alert, Button } from "antd";
import styles from "../../style.module.css";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/utils/fetcher";
import { PrinterOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const { Title, Text } = Typography;

type VehicleCertificate = {
  _id: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  fuelType: string;
  issuingState: string;
  make: string;
  model: string;
  vehiclePhotoUrl: string;
  type: string;
  yearOfManufacture: string;
  capacity: string;
  owner: {
    name: string;
    phoneNumber: string;
    email: string;
    dateOfBirth: string;
    address: string;
    city: string;
    gender: string;
    idNumber: string;
    lga: string;
    idDocumentUrl: string;
    state: string;
  };
  driver: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    state: string;
    lga: string;
    residentialAddress: string;
    phoneNumber: string;
    email: string;
    nin: string;
    validIdUrl: string;
    passportUrl: string;
    licenseNumber: string;
    licenseClass: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
    licenseUrl: string;
  };
  route: {
    stateCode: string;
    route: string;
    routeCode: string;
    registrationNo?: string;
    state: string;
  };
};

const useGetVehicleQuery = (vehicleId: string) => {
  return useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: () =>
      fetcher<{ success: boolean; data: VehicleCertificate }>({
        url: `/api/vehicles/${vehicleId}`,
        method: "GET",
      }),
    enabled: !!vehicleId,
  });
};

export default function VehicleCertificatePage() {
  const params = useParams();
  const vehicleId = params?.id as string;
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Vehicle Registration Certificate",
    pageStyle: `@media print {
      @page {
        size: A4 Landscape;
        margin: 24px;
      }
      
    }`
  });
  console.log(vehicleId);
  
  const { data, isLoading, error } = useGetVehicleQuery(vehicleId);

  if (isLoading) {
    return <Spin style={{ display: "block", margin: "100px auto" }} />;
  }
  if (error) {
    return <Alert type="error" message="Error loading certificate" description={error instanceof Error ? error.message : "Unknown error"} style={{ maxWidth: 600, margin: "100px auto" }} />;
  }
  const vehicle = data?.data;
  if (!vehicle) {
    return <Alert type="warning" message="Certificate not found" style={{ maxWidth: 600, margin: "100px auto" }} />;
  }
  const owner = vehicle.owner || {};
  const driver = vehicle.driver || {};
  const route = vehicle.route || {};

  return (
    <div className={styles.certificateWrapper} style={{ background: "#f8fafc", minHeight: "100vh", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 800, margin: "0 auto 16px auto" }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
          Back
        </Button>
        <Button icon={<PrinterOutlined />} type="primary" onClick={handlePrint}>
          Print
        </Button>
      </div>
      <div ref={printRef}>
        <Card style={{ maxWidth: 800, margin: "0 auto", borderRadius: 8, boxShadow: "0 2px 8px #f0f1f2" }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Row align="middle" gutter={8}>
                <Col>
                  <Image src="/entraco-logo.jpeg" alt="ENTRACO Logo" width={60} preview={false} />
                </Col>
                <Col>
                  <Title level={4} style={{ margin: 0 }}>ENUGU STATE TRANSPORT COMPANY</Title>
                  <Text type="secondary" style={{ fontWeight: 600, color: "#2C2C2C" }}>Registration Certificate</Text>
                </Col>
              </Row>
            </Col>
            <Col style={{ textAlign: "right" }}>
              <Text strong>Registration No</Text><br />
              <Text>{route.registrationNo || vehicle.registrationNumber}</Text>
            </Col>
          </Row>
          <Divider />
          {/* PERSONAL INFORMATION */}
          <Title level={5} style={{ marginTop: 0 }}>PERSONAL INFORMATION</Title>
          <Row gutter={24}>
            <Col flex="auto" >
              <div style={{ marginBottom: 16, }}>
                <Text strong>Full Name:</Text> {driver.fullName}<br />
                <Text strong>Date of Birth:</Text> {driver.dateOfBirth && new Date(driver.dateOfBirth).toLocaleDateString()}<br />
                <Text strong>National Identification Number (NIN):</Text> {driver.nin}<br />
                <Text strong>Nationality:</Text> {driver.nationality}<br />
                <Text strong>State of Origin:</Text> {driver.state}<br />
                <Text strong>Local Government Area:</Text> {driver.lga}<br />
                <Text strong>Phone Number:</Text> {driver.phoneNumber}<br />
                <Text strong>Email Address:</Text> {driver.email}
              </div>
            </Col>
            <Col>
              <Image src={driver.passportUrl} alt="Passport" width={120} height={120} style={{ borderRadius: 8, objectFit: "cover" }} preview={false} />
            </Col>
          </Row>
          {/* VEHICLE INFORMATION */}
          <Divider orientation="center" style={{ background: "#E7FCFF", padding: "10px 0" }}>
            <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>VEHICLE INFORMATION</Text>
          </Divider>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Registration Number:</Text><span>{vehicle.registrationNumber}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Chassis Number (VIN):</Text><span>{vehicle.chassisNumber}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Engine Number:</Text><span>{vehicle.engineNumber}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Vehicle Make:</Text><span>{vehicle.make}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Year of Manufacture:</Text><span>{vehicle.yearOfManufacture}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Vehicle Type:</Text><span>{vehicle.type}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Capacity (Number of Passengers):</Text><span>{vehicle.capacity}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Fuel Type:</Text><span>{vehicle.fuelType}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Plate Number Issuing State:</Text><span>{vehicle.issuingState}</span></div>
          </div>
          {/* OWNER INFORMATION */}
          <Divider orientation="center" style={{ background: "#E7FCFF", padding: "10px 0" }}>
            <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>OWNER INFORMATION</Text>
          </Divider>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Full Name:</Text><span>{owner.name}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Gender:</Text><span>{owner.gender}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Date of Birth:</Text><span>{owner.dateOfBirth && new Date(owner.dateOfBirth).toLocaleDateString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Phone Number:</Text><span>{owner.phoneNumber}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Email Address:</Text><span>{owner.email}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Residential Address:</Text><span>{owner.address}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Local Government Area:</Text><span>{owner.lga}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>State of Origin:</Text><span>{owner.state}</span></div>
          </div>
          {/* DRIVER INFORMATION */}
          <Divider orientation="center" style={{ background: "#E7FCFF", padding: "10px 0" }}>
            <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>DRIVER INFORMATION</Text>
          </Divider>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Driver's License Number:</Text><span>{driver.licenseNumber}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Class of License:</Text><span>{driver.licenseClass}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Issuing Authority:</Text><span>{driver.issuingAuthority}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Date of Issue:</Text><span>{driver.issueDate && new Date(driver.issueDate).toLocaleDateString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Expiry Date:</Text><span>{driver.expiryDate && new Date(driver.expiryDate).toLocaleDateString()}</span></div>
          </div>
          {/* ROUTE ASSIGNMENT */}
          <Divider orientation="center" style={{ background: "#E7FCFF", padding: "10px 0" }}>
            <Text strong style={{ color: "#2C2C2C", fontSize: 18 }}>ROUTE ASSIGNMENT</Text>
          </Divider>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Route:</Text><span>{route.route}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>State:</Text><span>{route.state}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Issuing Authority:</Text><span>{driver.issuingAuthority}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Date of Issue:</Text><span>{driver.issueDate && new Date(driver.issueDate).toLocaleDateString()}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Text strong>Expiry Date:</Text><span>{driver.expiryDate && new Date(driver.expiryDate).toLocaleDateString()}</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
} 