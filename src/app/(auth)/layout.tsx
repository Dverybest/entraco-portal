"use client";
import { Grid, Typography, theme } from "antd";
import Image from "next/image";
const { Title } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = useToken();
  const screens = useBreakpoint();
  const styles: Record<string, React.CSSProperties> = {
    container: {
      boxShadow: token.boxShadowSecondary,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "500px",
    },
    header: {
      display: "flex",
      flexDirection: "column",
      rowGap: token.marginMD,
      alignItems: "center",
      marginBottom: token.marginXL,
    },
    main: {
      justifyContent: "center",
      backgroundColor: token.colorWhite,
      display: "flex",
      minHeight: screens.sm ? "100vh" : "auto",
      padding: screens.md ? `${token.sizeXXL}px 0px` : "0px",
    },
  };
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.header}>
          <Image src={"/entraco-logo.jpeg"} alt="" height={85} width={85} />
          <Title style={{ fontSize: 16, lineHeight: "30px" }}>
            Enugu State Transport Company
            <br />
            <center> Registration Portal</center>
          </Title>
        </div>
        {children}
      </div>
    </main>
  );
}
