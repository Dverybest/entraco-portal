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
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("off");
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [isPending, startTransition] = useTransition();
  const lastScannedRef = useRef<{ code: string; timestamp: number } | null>(null);
  const router = useRouter();

  const stopScanner = async () => {
    try {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      await logToServer("Scanner stopped successfully");
    } catch (err) {
      console.error("Error stopping scanner:", err);
      await logToServer(`Error stopping scanner: ${err}`);
    }
  };

  const getCameras = async () => {
    try {
      if (typeof window === "undefined") return;

      await stopScanner();
      codeReaderRef.current = new BrowserMultiFormatReader();

      const videoDevices = await codeReaderRef.current.listVideoInputDevices();
      if (!videoDevices || videoDevices.length === 0) {
        message.error("No cameras found");
        await logToServer("No cameras found");
        return;
      }
      setCameras(videoDevices);
      setSelectedCamera(videoDevices[0].deviceId);
      await logToServer(
        `Available cameras: ${JSON.stringify(videoDevices)}`
      );
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
  }, []);

  useEffect(() => {
    if (selectedCamera === "off") {
      stopScanner();
    } else if (selectedCamera) {
      startScanner(selectedCamera);
    }
  }, [selectedCamera]);

  const startScanner = async (deviceId: string) => {
    if (!codeReaderRef.current || !videoRef.current) return;

    try {
      await logToServer(`Starting scanner with camera: ${deviceId}`);

      codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        async (result: Result | null) => {
          if (result) {
            const scannedCode = result.getText();
            const currentTime = Date.now();

            if (
              !lastScannedRef.current ||
              lastScannedRef.current.code !== scannedCode ||
              currentTime - lastScannedRef.current.timestamp > 3000
            ) {
              lastScannedRef.current = {
                code: scannedCode,
                timestamp: currentTime,
              };

              if (
                scannedCode.includes(
                  process.env.NEXT_PUBLIC_BASE_URL ||
                    "https://entraco-portal.netlify.app"
                )
              ) {
                setScanResult(scannedCode);
                playSuccessSound();
                toast.success("QR Code scanned successfully!");
                await logToServer(`QR Code scanned: ${scannedCode}`);
                await stopScanner();
                startTransition(() => {
                  router.push(scannedCode);
                });
              } else {
                playFailureSound();
                toast.error("Invalid QR code");
                await stopScanner();
              }
            }
          }
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
    if (selectedCamera !== "off") {
      startScanner(selectedCamera);
    }
  };

  const handleCameraChange = (cameraId: string) => {
    setSelectedCamera(cameraId);
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
                options={[
                  { value: "off", label: "Camera Off" },
                  ...cameras.map((camera) => ({
                    value: camera.deviceId,
                    label: camera.label || `Camera ${cameras.indexOf(camera) + 1}`,
                  })),
                ]}
                placeholder="Select a camera"
              />
              {selectedCamera !== "off" && (
                <video
                  ref={videoRef}
                  style={{
                    width: "100%",
                    maxWidth: 600,
                    margin: "0 auto",
                    borderRadius: 8,
                  }}
                  playsInline
                  muted
                  autoPlay
                />
              )}
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
                disabled={selectedCamera === "off"}
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
