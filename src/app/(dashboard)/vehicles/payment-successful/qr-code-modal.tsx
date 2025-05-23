"use client";
import { Modal, Button, QRCode, Space, Typography } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styles from "./styles.module.css";
import Image from "next/image";

const { Text } = Typography;

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleUrl: string;
  title?: string;
}

const CustomQRCode = ({ value, size }: { value: string; size: number }) => {
  return (
    <div className={styles["qr-wrapper"]}>
      <QRCode
        value={value}
        size={size}
        errorLevel="H"
        className={styles["qr-code"]}
      />
      <div className={styles["logo-overlay"]}>
        <Image
          src="/entraco-logo.jpeg"
          alt="ENTRACO Logo"
          width={size * 0.2}
          height={size * 0.2}
          className={styles["logo"]}
        />
      </div>
    </div>
  );
};

export const QRCodeModal = ({
  isOpen,
  onClose,
  vehicleUrl,
  title = "Vehicle Details QR Code",
}: QRCodeModalProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: qrRef,
    documentTitle: "Vehicle Details QR Code",
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .qr-container {
          text-align: center;
        }
        .qr-code {
          width: 300px !important;
          height: 300px !important;
        }
        .url-text {
          margin-top: 10px;
          font-size: 14px;
          color: #666;
          word-break: break-all;
        }
      }
    `,
  });

  return (
    <Modal
      title={title}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="print"
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}>
          Print QR Code
        </Button>,
      ]}
      width={400}
      centered>
      <div  style={{ textAlign: "center", padding: "20px 0" }}>
        <div className="qr-container">
          <div ref={qrRef} className={styles["qr-body"]}>
            <CustomQRCode value={vehicleUrl} size={256} />
          </div>

          <Space direction="vertical" style={{ width: "100%" }}>
            <Text type="secondary">
              Scan this QR code to view vehicle details
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: 12, wordBreak: "break-all" }}>
              {vehicleUrl}
            </Text>
          </Space>
        </div>
      </div>
    </Modal>
  );
};
