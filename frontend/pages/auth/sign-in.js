import {
  Button,
  Center,
  Checkbox,
  Container,
  Input,
  InputWrapper,
  Text,
} from "@mantine/core";
import router from "next/router";
import { useState } from "react";
import { At, Eye, EyeOff, Lock, LockOpen } from "tabler-icons-react";
import handleError from "../../src/helpers/handleError";
import Server from "../../src/Server";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [signingInOne, setSigningInOne] = useState(false);

  const handleSignIn = (e) => {
    e.preventDefault();

    setSigningInOne(true);
    Server.post("/auth/sign-in/one", {
      email: e.target["email"].value,
      password: e.target["password"].value,
      rememberMe: e.target["rememberMe"].checked,
    })
      .then((res) => {
        const { userData } = res.data;

        setSigningInOne(false);

        if (userData.enabled2fa) {
          router.replace(
            `/auth/verify/enter-code?email=${encodeURIComponent(
              e.target["email"].value
            )}&password=${encodeURIComponent(
              e.target["password"].value
            )}&rememberMe=${encodeURIComponent(e.target["rememberMe"].checked)}`
          );
          return;
        }

        localStorage.setItem("otpauth", userData.qrSecret);
        router.push(
          `/auth/verify/scan?email=${encodeURIComponent(
            e.target["email"].value
          )}&password=${encodeURIComponent(
            e.target["password"].value
          )}&rememberMe=${encodeURIComponent(e.target["rememberMe"].checked)}`
        );
      })
      .catch((error) => {
        handleError(error, "Sign-in Error");
        setSigningInOne(false);
      });
  };

  return (
    <Center
      component={"form"}
      style={{
        width: "100%",
        height: "100vh",
      }}
      onSubmit={handleSignIn}
    >
      <Container
        style={{
          width: "95%",
          maxWidth: "464px",
          display: "flex",
          flexDirection: "column",
          gridGap: "16px",
        }}
      >
        <InputWrapper size={"md"}>
          <Input
            name={"email"}
            icon={<At />}
            placeholder={"Email"}
            type={"email"}
            size={"md"}
          />
        </InputWrapper>

        <InputWrapper size={"md"}>
          <Input
            name={"password"}
            icon={<Lock />}
            placeholder={"Password"}
            type={showPassword ? "text" : "password"}
            size={"md"}
            rightSection={
              showPassword ? (
                <EyeOff
                  width={"18px"}
                  height={"18px"}
                  color={"#ADB5BD"}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                />
              ) : (
                <Eye
                  width={"18px"}
                  height={"18px"}
                  color={"#ADB5BD"}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                />
              )
            }
          />
        </InputWrapper>

        <InputWrapper size={"md"}>
          <Checkbox name={"rememberMe"} label={"Remember Me"} size={"md"} />
        </InputWrapper>

        <Button
          size={"md"}
          leftIcon={<LockOpen />}
          type={"submit"}
          loading={signingInOne}
        >
          Continue
        </Button>

        <Text align={"center"}>
          Don't have an account yet?&nbsp;
          <Text variant={"link"} component={"a"} href={"/auth/sign-up"}>
            Create an account!
          </Text>
        </Text>
      </Container>
    </Center>
  );
};

export default SignInPage;
