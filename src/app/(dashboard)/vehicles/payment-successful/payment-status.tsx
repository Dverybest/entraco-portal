"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { PaymentStatusResult } from "./payment-status-result";
import { useEffect, useState } from "react";
import { useGetPaymentVerificationQuery } from "@/hooks/api/useGetPaymentVerificationQuery";

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const success = searchParams.get("success");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [verificationTimeout, setVerificationTimeout] = useState(false);

  const {
    data: verificationResponse,
    error,
    isFetching,
    refetch,
  } = useGetPaymentVerificationQuery(reference ?? "");

  useEffect(() => {
    if (verificationResponse?.data.status === "paid") {
      setIsRedirecting(true);
      const redirectTimer = setTimeout(() => {
        router.push(`/vehicles/${verificationResponse.data.vehicle._id}`);
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [verificationResponse, router]);

  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      if (isFetching) {
        setVerificationTimeout(true);
      }
    }, 30000); // 30 seconds timeout

    return () => clearTimeout(timeoutTimer);
  }, [isFetching]);

  const handleRetry = () => {
    setVerificationTimeout(false);
    refetch();
  };

  const vehicleUrl = verificationResponse?.data.vehicle._id
    ? `${window.location.origin}/vehicles/${verificationResponse.data.vehicle._id}`
    : undefined;

  if (!reference || success !== "true") {
    return <PaymentStatusResult status="invalid" />;
  }

  if (verificationTimeout) {
    return (
      <PaymentStatusResult
        status="timeout"
        isFetching={isFetching}
        onRetry={handleRetry}
      />
    );
  }

  if (error) {
    return (
      <PaymentStatusResult
        status="error"
        error={error}
        isFetching={isFetching}
        onRetry={handleRetry}
      />
    );
  }

  if (isRedirecting) {
    return (
      <PaymentStatusResult
        status="success"
        vehicleUrl={vehicleUrl}
      />
    );
  }

  return <PaymentStatusResult status="loading" />;
}
