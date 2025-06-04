"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import {
  Card,
  Typography,
  Button,
  message,
  Row,
  Col,
  Flex,
  theme,
  Select,
  Spin,
} from "antd";
import { Html5Qrcode } from "html5-qrcode";
import { ScanOutlined } from "@ant-design/icons";
import React from "react";
import { useRouter } from "next/navigation";
import { logToServer } from "@/utils/log-server";
import { toast } from "react-toastify";
import { playSuccessSound, playFailureSound } from "@/utils/play-sound";
import { BrowserMultiFormatReader, Result } from "@zxing/library";

const { Title, Text } = Typography;

export default function ScanPage() {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isScanning, setIsScanning] = useState(false);
  const [isPending, startTransition] = useTransition();
  const lastScannedRef = useRef<{ code: string; timestamp: number } | null>(null);
  const router = useRouter();

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
        await logToServer("Scanner stopped and cleared successfully");
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
      await logToServer(`Error stopping scanner: ${err}`);
    }
  };

  const getCameras = async () => {
    try {
      if (typeof window === "undefined") return;

      // First stop any existing scanner
      await stopScanner();

      const availableCameras = await Html5Qrcode.getCameras();
      if (availableCameras && availableCameras.length) {
        const formattedCameras = availableCameras.map((camera) => ({
          id: camera.id,
          label: camera.label || `Camera ${camera.id}`,
        }));
        setCameras(formattedCameras);
        setSelectedCamera(formattedCameras[0].id);
        await logToServer(
          `Available cameras: ${JSON.stringify(formattedCameras)}`
        );
      } else {
        message.error("No cameras found");
        await logToServer("No cameras found");
      }
    } catch (err) {
      console.error("Error getting cameras:", err);
      message.error("Failed to get camera list");
      await logToServer(`Error getting cameras: ${err}`);
    }
  };

  useEffect(() => {
    getCameras();
    return () => {
      stopScanner();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanner = async () => {
    if (isPending) return;
    try {
      if (typeof window === "undefined" || !selectedCamera) return;

      // Ensure any existing scanner is stopped
      await stopScanner();

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;
      setIsScanning(true);

      await logToServer(`Starting scanner with camera: ${selectedCamera}`);

      await html5QrCode.start(
        selectedCamera,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        async (decodedText) => {
          const currentTime = Date.now();
          const lastScanned = lastScannedRef.current;

          // Only process if it's a new code or enough time has passed
          if (
            !lastScanned ||
            lastScanned.code !== decodedText ||
            currentTime - lastScanned.timestamp > 3000
          ) {
            lastScannedRef.current = {
              code: decodedText,
              timestamp: currentTime,
            };

            if (
              decodedText.includes(
                process.env.NEXT_PUBLIC_BASE_URL ||
                  "https://entraco-portal.netlify.app"
              )
            ) {
              setScanResult(decodedText);
              playSuccessSound();
              toast.success("QR Code scanned successfully!");
              await logToServer(`QR Code scanned: ${decodedText}`);
              await stopScanner();
              startTransition(() => {
                router.push(decodedText);
              });
            } else {
              playFailureSound();
              toast.error("Invalid QR code");
              await stopScanner();
            }
          }
        },
        async (errorMessage) => {
          console.warn(`QR Code scan error: ${errorMessage}`);
          await logToServer(`QR Code scan error: ${errorMessage}`);
        }
      );
    } catch (err) {
      console.error("Error starting scanner:", err);
      message.error("Failed to start camera");
      await logToServer(`Error starting scanner: ${err}`);
      await stopScanner();
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    lastScannedRef.current = null;
    startScanner();
  };

  const handleCameraChange = async (cameraId: string) => {
    setSelectedCamera(cameraId);
    await stopScanner();
    await startScanner();
  };

  if (isPending) {
    return <Spin style={{ display: "block", margin: "100px auto" }} />;
  }

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
                options={cameras.map((camera) => ({
                  value: camera.id,
                  label: camera.label,
                }))}
                placeholder="Select a camera"
              />
              <div
                id="qr-reader"
                style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
              />
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
                {scanResult ? "Scan Again" : "Start Scanning"}
              </Button>
            </Flex>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
