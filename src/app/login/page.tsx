"use client";

import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import "antd/dist/reset.css";

const LoginPage = () => {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");

  const onFinish = async (values: any) => {
    setErrorMessage("");
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.status === 200) {
      message.success("Login successful!");
      router.push("/dashboard");
    } else {
      setErrorMessage("Invalid email or password!");
      message.error("Invalid email or password!");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      
      {/* left side section login form start */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8 md:p-10">
        <div className="max-w-md w-full">
          <Title level={2} className="text-left">
            <p className="mb-6 font-inter font-bold text-[20px] leading-[125%]">
              Welcome back
            </p>
          </Title>

          <Form
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="email"
              className="font-bold"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              className="font-bold"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password size="large" iconRender={() => null} />
            </Form.Item>

            {errorMessage && (
              <p className="text-red-500 mb-4 text-sm">{errorMessage}</p>
            )}

            <div className="flex items-center justify-between mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-[#1A56DB] hover:bg-[#174cc9] text-white opacity-100 gap-2 px-5 py-2.5 rounded-lg"
                size="large"
              >
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      {/* left side section login form end */}
      
      {/* right section start paragraph text start */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-white p-8 sm:p-10 md:p-12" style={{ background: "var(--primary-600, #1C64F2)" }}>
        <div className="max-w-lg mx-auto text-center md:text-left">
          <Title level={2} className="!text-white mb-4">
            ticktock
          </Title>
          <Paragraph className="!text-white text-base sm:text-lg leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any
            internet-connected device.
          </Paragraph>
        </div>
      </div>
      {/* right section start paragraph text end */}

    </div>
  );
};

export default LoginPage;
