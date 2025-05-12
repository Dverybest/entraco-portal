import { Grid, theme } from "antd";

const { useToken } = theme;
const { useBreakpoint } = Grid;

export const useStyles = () => {
  const { token } = useToken();
  const screens = useBreakpoint();
  const styles: Record<string, React.CSSProperties> = {
    container: {
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: "380px",
    },
    forgotPassword: {
      float: "right",
    },
    header: {
      marginBottom: token.marginXL,
    },
    text: {
      color: token.colorTextSecondary,
      marginBottom: token.marginMD,
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
    },
  };
  return styles;
};
