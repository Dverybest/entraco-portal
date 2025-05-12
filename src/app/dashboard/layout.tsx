"use client";
import {
  HomeOutlined,
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Flex,
  Layout,
  Menu,
  Modal,
  theme,
} from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const { Header, Sider, Content } = Layout;

const App: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();

  const { firstName, lastName } = { firstName: "John", lastName: "Doe" }; // Replace with actual user data
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeKey = useMemo(() => {
    if (pathName.includes("market")) {
      return "/dashboard/markets";
    } else if (pathName.includes("shop-allocations")) {
      return "/dashboard/vehicles";
    } else {
      return "/dashboard";
    }
  }, [pathName]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh", overflowY: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        theme={"light"}
        collapsed={collapsed}
        style={{ background: colorBgContainer }}
      >
        <Flex justify={"center"} align={"center"} style={{ marginBottom: 24 }}>
          <Image src={"/entraco-logo.jpeg"} alt="" width={70} height={70} />
        </Flex>
        <Menu
          theme="light"
          mode={"vertical"}
          onClick={(info) => router.push(info.key)}
          defaultSelectedKeys={[pathName]}
          activeKey={activeKey}
          items={[
            {
              key: "/dashboard",
              icon: <HomeOutlined />,
              label: "Home",
            },
            {
              key: "/dashboard/vehicles",
              icon: <ShopOutlined />,
              label: "Vehicles",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 24,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
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
            }}
          >
            <Avatar
              style={{
                verticalAlign: "middle",
                background: "#D1FAE0",
                borderColor: "#80CBC4",
                color: "black",
              }}
              size="large"
              gap={2}
            >
              {`${firstName?.[0]}${lastName?.[0]}`}
            </Avatar>
          </Dropdown>
        </Header>
        <Content style={{ overflowY: "auto" }}>{children}</Content>
      </Layout>
      <Modal
        title="Logout"
        open={isModalOpen}
        okButtonProps={{
          type: "primary",
          variant: "solid",
          color: "danger",
        }}
        onOk={() => {
          router.replace("/");
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p> Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default App;
