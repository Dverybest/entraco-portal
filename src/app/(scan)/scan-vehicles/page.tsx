'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, Typography, Button, message, Row, Col, Flex, theme, Select } from 'antd';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanOutlined } from "@ant-design/icons";
import React from "react";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export default function ScanPage() {
  const { token: { colorPrimary } } = theme.useToken();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    getCameras();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const getCameras = async () => {
    try {
      if (typeof window === 'undefined') return;

      const availableCameras = await Html5Qrcode.getCameras();
      if (availableCameras && availableCameras.length) {
        const formattedCameras = availableCameras.map(camera => ({
          id: camera.id,
          label: camera.label || `Camera ${camera.id}`
        }));
        setCameras(formattedCameras);
        setSelectedCamera(formattedCameras[0].id);
      } else {
        message.error('No cameras found');
      }
    } catch (err) {
      console.error('Error getting cameras:', err);
      message.error('Failed to get camera list');
    }
  };

  const startScanner = async () => {
    try {
      if (typeof window === 'undefined' || !selectedCamera) return;

      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScanResult(decodedText);
          message.success('QR Code scanned successfully!');
          html5QrCode.stop().catch(console.error);
          
          // Extract vehicle ID from the URL
          const vehicleId = decodedText.split('/').pop();
          if (vehicleId) {
            router.push(`/vehicles/${vehicleId}`);
          } else {
            message.error('Invalid QR code format');
          }
        },
        (errorMessage) => {
          console.warn(`QR Code scan error: ${errorMessage}`);
        }
      );
    } catch (err) {
      console.error('Error starting scanner:', err);
      message.error('Failed to start camera');
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    startScanner();
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
    }
    startScanner();
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}>
            <Flex vertical align="center" gap={24}>
              <Title level={2} style={{ margin: 0, textAlign: "center" }}>
                Welcome to Scan Portal
              </Title>
              <Text type="secondary" style={{ textAlign: "center" }}>
                Scan QR codes or barcodes to process transactions quickly and
                efficiently
              </Text>
            </Flex>
          </Card>
        </Col>

        <Col xs={24}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}>
            <Flex vertical gap={16} align="center">
              <Select
                style={{ width: 300 }}
                value={selectedCamera}
                onChange={handleCameraChange}
                options={cameras.map(camera => ({
                  value: camera.id,
                  label: camera.label
                }))}
                placeholder="Select a camera"
              />
              <div id="qr-reader" style={{ width: '100%', maxWidth: 600, margin: '0 auto' }} />
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              height: "100%",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}>
            <Flex vertical align="center" gap={16}>
              <ScanOutlined
                style={{
                  fontSize: 48,
                  color: colorPrimary,
                }}
              />
              <Title level={4} style={{ margin: 0, textAlign: "center" }}>
                Scan QR Code
              </Title>
              <Text type="secondary" style={{ textAlign: "center" }}>
                Scan QR codes to view vehicle details
              </Text>
              <Button
                type="primary"
                size="large"
                icon={<ScanOutlined />}
                onClick={handleRescan}
                style={{ marginTop: 16 }}>
                {scanResult ? 'Scan Again' : 'Start Scanning'}
              </Button>
            </Flex>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
