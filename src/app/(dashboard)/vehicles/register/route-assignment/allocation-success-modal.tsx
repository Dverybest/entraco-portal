import { Modal, Button, Space } from "antd";
import React from "react";


export const AllocationSuccessModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
  onPaymentClick: () => void;
}> = ({ isOpen, closeModal, onPaymentClick }) => {

 

  return (
    <Modal
      width="600px"
      centered
      open={isOpen}
      footer={null}
      onCancel={closeModal}>
      <div style={{ padding: 24 }}>
        <h2>Registration Successful!</h2>
        <p>
          Your vehicle has been successfully registered. To complete the
          process, please make the payment.
        </p>

        <Space style={{ marginTop: 24, justifyContent: "flex-end" }}>
          <Button type="primary" onClick={onPaymentClick}>
            Proceed to Payment
          </Button>
          {/* <Button onClick={() => {
            reactToPrintFn();
          }}>
            Print Allocation Letter
          </Button>
          <Button onClick={closeModal}>
            Close
          </Button> */}
        </Space>
      </div>
    </Modal>
  );
};
