"use client";
import { fetcher } from "@/utils/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Typography, Flex, Button, Result } from "antd";
import { CheckCircleOutlined, ReloadOutlined, QrcodeOutlined } from "@ant-design/icons";
import { QRCodeModal } from "./qr-code-modal";

const { Title, Text } = Typography;



const VERIFICATION_TIMEOUT = 30000; // 30 seconds timeout

export default function PaymentSuccessful() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const success = searchParams.get("success");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [verificationTimeout, setVerificationTimeout] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [vehicleUrl, setVehicleUrl] = useState("");

  const { data: verificationResponse, error, refetch, isFetching } = useQuery<VerificationResponse>({
    queryKey: ["verifyPayment", reference],
    queryFn: () => {
      if (!reference) throw new Error("No reference provided");
      return fetcher({
        url: `/api/vehicles/verify-payment/${reference}`,
        method: "GET",
      });
    },
    enabled: !!reference && success === "true",
    retry: 2, // Retry failed requests twice
    retryDelay: 1000, // Wait 1 second between retries
  });

  useEffect(() => {
    // Set up verification timeout
    const timeoutId = setTimeout(() => {
      setVerificationTimeout(true);
    }, VERIFICATION_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (verificationResponse) {
      console.log("Payment verification response:", verificationResponse);
      
      if (verificationResponse.success && verificationResponse.data.vehicle._id) {
        const url = `${window.location.origin}/vehicles/${verificationResponse.data.vehicle._id}`;
        setVehicleUrl(url);
        setIsRedirecting(true);
        // Add a small delay before redirecting to show the success state
        setTimeout(() => {
          router.push(`/vehicles/${verificationResponse.data.vehicle._id}`);
        }, 1500);
      }
    }
  }, [verificationResponse, router]);

  const handleRetry = () => {
    setVerificationTimeout(false);
    refetch();
  };

  if (!reference || success !== "true") {
    return (
      <Result
        status="error"
        title="Invalid Payment Response"
        subTitle="The payment response is invalid or missing required parameters."
        extra={[
          <Button type="primary" key="contact" onClick={() => router.push('/contact')}>
            Contact Support
          </Button>,
        ]}
      />
    );
  }

  if (verificationTimeout) {
    return (
      <Result
        status="warning"
        title="Verification Taking Too Long"
        subTitle="The payment verification is taking longer than expected. You can try again or contact support if the issue persists."
        extra={[
          <Button 
            type="primary" 
            key="retry" 
            icon={<ReloadOutlined />} 
            onClick={handleRetry}
            loading={isFetching}
          >
            Retry Verification
          </Button>,
          <Button key="contact" onClick={() => router.push('/contact')}>
            Contact Support
          </Button>,
        ]}
      />
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Payment Verification Failed"
        subTitle={
          error instanceof Error 
            ? error.message 
            : "There was an error verifying your payment. Please try again or contact support."
        }
        extra={[
          <Button 
            type="primary" 
            key="retry" 
            icon={<ReloadOutlined />} 
            onClick={handleRetry}
            loading={isFetching}
          >
            Retry Verification
          </Button>,
          <Button key="contact" onClick={() => router.push('/contact')}>
            Contact Support
          </Button>,
        ]}
      />
    );
  }

  if (isRedirecting) {
    return (
      <>
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Payment Verified Successfully!"
          subTitle="Redirecting you to the vehicle details page..."
          extra={[
            <Button
              key="qr"
              type="primary"
              icon={<QrcodeOutlined />}
              onClick={() => setIsQRModalOpen(true)}
            >
              View QR Code
            </Button>,
          ]}
        />
        <QRCodeModal
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
          vehicleUrl={vehicleUrl}
          title="Vehicle Details QR Code"
        />
      </>
    );
  }

  return (
    <Flex vertical align="center" justify="center" style={{ height: "100vh" }}>
      <Spin size="large" />
      <Title level={3} style={{ marginTop: 24 }}>
        Verifying Your Payment
      </Title>
      <Text>Please wait while we confirm your payment status...</Text>
      <Text type="secondary" style={{ marginTop: 8 }}>
        This may take up to 30 seconds
      </Text>
    </Flex>
  );
}
