"use client";
import {
  LoginOutlined,

} from "@ant-design/icons";
import {
  Avatar,
  Dropdown,
  Flex,
  Layout,
  Modal,
  theme,
} from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
// import {  useRouter } from "next/navigation";
import React, { useState } from "react";

const { Header, Content } = Layout;

const ScanLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
//   const router = useRouter();
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleLogout = async () => {
    setIsModalOpen(false);
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: "0 24px",
          background: colorBgContainer,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}>
        <Flex align="center" gap={16}>
          <Image src={"/entraco-logo.jpeg"} alt="" width={40} height={40} />
          <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Scan Portal</span>
        </Flex>
        <Dropdown
          menu={{
            items: [
              {
                label: "Log out",
                key: "1",
                icon: <LoginOutlined />,
                onClick: () => setIsModalOpen(true),
              },
            ],
          }}>
          <Avatar
            style={{
              verticalAlign: "middle",
              background: "#D1FAE0",
              borderColor: "#80CBC4",
              color: "black",
              cursor: "pointer",
            }}
            size="large"
            gap={2}>
            {session?.user?.name?.[0] || "U"}
          </Avatar>
        </Dropdown>
      </Header>
      <Content
        style={{
          padding: "24px",
          background: "#f5f5f5",
          minHeight: "calc(100vh - 64px)",
        }}>
        {children}
      </Content>
      <Modal
        title="Logout"
        open={isModalOpen}
        okButtonProps={{
          type: "primary",
          danger: true,
        }}
        onOk={handleLogout}
        onCancel={() => {
          setIsModalOpen(false);
        }}>
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default ScanLayout; 