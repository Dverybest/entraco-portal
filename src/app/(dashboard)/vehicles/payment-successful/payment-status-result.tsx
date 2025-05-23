"use client";

import { Button, Result } from "antd";
import { CheckCircleOutlined, QrcodeOutlined, ReloadOutlined } from "@ant-design/icons";
import { QRCodeModal } from "./qr-code-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PaymentStatusResultProps {
  status: "invalid" | "timeout" | "error" | "success" | "loading";
  error?: Error | string;
  isFetching?: boolean;
  vehicleUrl?: string;
  onRetry?: () => void;
}

export const PaymentStatusResult = ({
  status,
  error,
  isFetching,
  vehicleUrl,
  onRetry,
}: PaymentStatusResultProps) => {
  const router = useRouter();
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const handleContactSupport = () => {
    router.push('/contact');
  };

  const handleViewQRCode = () => {
    setIsQRModalOpen(true);
  };

  const statusConfig = {
    invalid: {
      status: "error" as const,
      title: "Invalid Payment Response",
      subTitle: "The payment response is invalid or missing required parameters.",
      extra: [
        <Button type="primary" key="contact" onClick={handleContactSupport}>
          Contact Support
        </Button>,
      ],
    },
    timeout: {
      status: "warning" as const,
      title: "Verification Taking Too Long",
      subTitle: "The payment verification is taking longer than expected. You can try again or contact support if the issue persists.",
      extra: [
        <Button
          type="primary"
          key="retry"
          icon={<ReloadOutlined />}
          onClick={onRetry}
          loading={isFetching}
        >
          Retry Verification
        </Button>,
        <Button key="contact" onClick={handleContactSupport}>
          Contact Support
        </Button>,
      ],
    },
    error: {
      status: "error" as const,
      title: "Payment Verification Failed",
      subTitle: error instanceof Error ? error.message : "There was an error verifying your payment. Please try again or contact support.",
      extra: [
        <Button
          type="primary"
          key="retry"
          icon={<ReloadOutlined />}
          onClick={onRetry}
          loading={isFetching}
        >
          Retry Verification
        </Button>,
        <Button key="contact" onClick={handleContactSupport}>
          Contact Support
        </Button>,
      ],
    },
    success: {
      status: "success" as const,
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      title: "Payment Verified Successfully!",
      subTitle: "Redirecting you to the vehicle details page...",
      extra: [
        <Button
          key="qr"
          type="primary"
          icon={<QrcodeOutlined />}
          onClick={handleViewQRCode}
        >
          View QR Code
        </Button>,
      ],
    },
    loading: {
      status: "info" as const,
      title: "Verifying Your Payment",
      subTitle: "Please wait while we confirm your payment status...",
    },
  };

  const config = statusConfig[status];

  return (
    <>
      <Result {...config} />
      {status === "success" && vehicleUrl && (
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          vehicleUrl={vehicleUrl}
          title="Vehicle Details QR Code"
        />
      )}
    </>
  );
}; 