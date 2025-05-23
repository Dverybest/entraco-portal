"use client";
import {
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
  Spin,
  theme,
} from "antd";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
const { Header, Sider, Content } = Layout;

const App: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const router = useRouter();
  const pathName = usePathname();
  const { status, data: session } = useSession();
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

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "loading") {
    return (
      <center>
        <Spin spinning />
      </center>
    );
  }

  const handleLogout = async () => {
    setIsModalOpen(false);
    await signOut({
      redirect: true,
      callbackUrl: "/login",
    });
  };

  return (
    <Layout style={{ height: "100vh", overflowY: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        theme={"light"}
        collapsed={collapsed}
        style={{ background: colorBgContainer }}>
        <Flex
          justify={"center"}
          align={"center"}
          style={{ marginBottom: 24, marginTop: 24 }}>
          <Image src={"/entraco-logo.jpeg"} alt="" width={70} height={70} />
        </Flex>
        <Menu
          theme="light"
          mode={"vertical"}
          onClick={(info) => router.push(info.key)}
          defaultSelectedKeys={[pathName]}
          activeKey={activeKey}
          items={[
            // {
            //   key: "/",
            //   icon: <HomeOutlined />,
            //   label: "Home",
            // },
            {
              key: "/vehicles",
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
          }}>
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
            }}>
            <Avatar
              style={{
                verticalAlign: "middle",
                background: "#D1FAE0",
                borderColor: "#80CBC4",
                color: "black",
              }}
              size="large"
              gap={2}>
              {session?.user?.name?.[0] || "U"}
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
        onOk={handleLogout}
        onCancel={() => {
          setIsModalOpen(false);
        }}>
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
};

export default App;
