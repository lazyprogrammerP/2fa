import { Button, Center, Container, List, Text } from "@mantine/core";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useEffect, useRef } from "react";

const ScanQRPage = () => {
  const qrCanvas = useRef("");

  const router = useRouter();
  const { email, password, rememberMe } = router.query;

  useEffect(() => {
    const otpauth = localStorage.getItem("otpauth");
    QRCode.toCanvas(qrCanvas.current, otpauth, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }, []);

  const redirectToEnterCode = () => {
    localStorage.clear();
    router.replace(
      `/auth/verify/enter-code?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(
        password
      )}&rememberMe=${encodeURIComponent(rememberMe)}`
    );
  };

  return (
    <Center
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <Container
        style={{
          maxWidth: "768px",
        }}
      >
        <Text>
          In order to protect your account from unauthorized access we require
          both a password and possessio of your phone to access your account.
          Please install Microsoft Authenticator app through the following steps
          for us to verify that you have possession of your phone.
        </Text>

        <Container my={"sm"}>
          <List type={"ordered"}>
            <List.Item>
              Install the Microsoft Authenticator App from IOS App Store /
              Android Play Store.
            </List.Item>
            <List.Item>Open the Microsoft Authenticator App.</List.Item>
            <List.Item>Click I agree for permissions to use the app.</List.Item>
            <List.Item>Click Scan a QR Code.</List.Item>
            <List.Item>Scan the QR Code below.</List.Item>
          </List>
        </Container>

        <Container mb={"sm"}>
          <canvas
            ref={qrCanvas}
            style={{
              display: "block",
              margin: "0px auto",
            }}
          />
        </Container>

        <Container
          mb={"sm"}
          style={{
            maxWidth: "464px",
          }}
        >
          <Text align={"center"}>
            When the Microsoft Authenticator App displays a six-digit code,
            click the continue button below.
          </Text>
        </Container>

        <Button
          style={{
            display: "block",
          }}
          mx={"auto"}
          onClick={redirectToEnterCode}
        >
          Continue
        </Button>
      </Container>
    </Center>
  );
};

export default ScanQRPage;
