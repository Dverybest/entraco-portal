import { Modal } from "antd";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export const AllocationSuccessModal: React.FC<{
  isOpen: boolean;
  closeModal: () => void;
}> = ({ isOpen, closeModal }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <Modal
      width="900px"
      okText="Print Allocation Letter"
      cancelText="Close"
      centered
      open={isOpen}
      okButtonProps={{
        onClick: () => {
          reactToPrintFn();
        },
      }}
      onCancel={closeModal}
    >
      <div ref={contentRef} style={{ margin: 24, border: "1px solid #eee" }}>
        {/* <AllocationLetter
          data={{}}
        /> */}
      </div>
    </Modal>
  );
};
