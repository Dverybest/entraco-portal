"use client";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useStyles } from "./useStyles";
import { useState } from "react";
import { getCookieValue, removeCookie } from "@/utils";
import { CookieType } from "@/cookieType";
type ILoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage() {
  const router = useRouter();
  const styles = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  

  const onFinish = async (values: ILoginForm) => {
    const previousUrl = getCookieValue(CookieType.CurrentUrl) as string;
    
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    console.log(res, "RESPONSE");
    

    if (res?.ok) {
      // Get the token to access role
      const response = await fetch("/api/get-role");
      const data = await response.json();

      console.log(data, "DATE FOR ROLE");
      
      
      toast.success("Login successful");
      // Redirect to previous URL if available, otherwise use role-based redirect
      router.replace(previousUrl || (data.role === "super_admin" ? "/" : "/vehicles"));
      if (previousUrl) {
        removeCookie(CookieType.CurrentUrl);
        removeCookie(CookieType.ExpiryMessage);
      }
    } else {
      toast.error("Invalid email or password");
    }
    setIsLoading(false);
  };

  return (
    <section style={styles.container}>
      <p style={styles.text}>Enter your details below to sign in.</p>
      <Form
        name="normal_login"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a style={styles.forgotPassword} href="">
            Forgot password?
          </a>
        </Form.Item>
        <Form.Item style={{ marginBottom: "0px" }}>
          <Button loading={isLoading} disabled={isLoading} block type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
}
