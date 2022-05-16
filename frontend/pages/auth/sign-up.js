import {
  Button,
  Center,
  Container,
  Input,
  InputWrapper,
  List,
  Modal,
  Text,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import router from "next/router";
import { useState } from "react";
import {
  At,
  Check,
  CircleCheck,
  CircleX,
  Cross,
  Eye,
  EyeOff,
  Lock,
  LockOpen,
  X,
} from "tabler-icons-react";
import handleError from "../../src/helpers/handleError";
import handleSuccess from "../../src/helpers/handleSuccess";
import Server from "../../src/Server";

const SignUpPage = () => {
  const theme = useMantineTheme();

  const [showPassword, setShowPassword] = useState(false);

  const [signingUp, setSigningUp] = useState(false);

  const [openVerifyEmailModal, setOpenVerifyEmailModal] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    hasEightChars: false,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });

  const handleSignUp = (e) => {
    e.preventDefault();

    if (
      !passwordValidation.hasEightChars ||
      !passwordValidation.hasUppercase ||
      !passwordValidation.hasLowercase ||
      !passwordValidation.hasDigit ||
      !passwordValidation.hasSpecialChar
    ) {
      showNotification({
        title: "Weak Password",
        message: "Please make sure the password matches the requirements.",
        color: "yellow",
      });
      return;
    }

    setSigningUp(true);
    Server.post("/auth/sign-up", {
      firstName: e.target["firstName"].value,
      lastName: e.target["lastName"].value,
      email: e.target["email"].value,
      password: e.target["password"].value,
    })
      .then((res) => {
        handleSuccess(res);
        setSigningUp(false);
        setOpenVerifyEmailModal(true);
      })
      .catch((error) => {
        handleError(error, "Sign-up Error");
        setSigningUp(false);
      });
  };

  const redirectToLogin = () => {
    router.push("/auth/sign-in");
  };

  return (
    <>
      <Center
        component={"form"}
        style={{
          width: "100%",
          height: "100vh",
        }}
        onSubmit={handleSignUp}
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
              name={"firstName"}
              // icon={<At />}
              placeholder={"First Name"}
              type={"text"}
              size={"md"}
            />
          </InputWrapper>

          <InputWrapper size={"md"}>
            <Input
              name={"lastName"}
              // icon={<At />}
              placeholder={"Last Name"}
              type={"text"}
              size={"md"}
            />
          </InputWrapper>

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
              onChange={(e) => {
                const updatedPassword = e.target.value;
                setPasswordValidation({
                  hasUppercase: Boolean(updatedPassword.match(/(?=.*?[A-Z])/)),
                  hasLowercase: Boolean(updatedPassword.match(/(?=.*?[a-z])/)),
                  hasDigit: Boolean(updatedPassword.match(/(?=.*?[0-9])/)),
                  hasSpecialChar: Boolean(
                    updatedPassword.match(/(?=.*?[#?!@$%^&*-])/)
                  ),
                  hasEightChars: Boolean(updatedPassword.match(/.{8,}/)),
                });
              }}
            />

            <Container p={0} mt={"8px"}>
              <List>
                <Container
                  p={0}
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gridGap: "8px",
                  }}
                >
                  <List.Item
                    icon={
                      passwordValidation.hasEightChars ? (
                        <Check width={"15px"} height={"15px"} color={"green"} />
                      ) : (
                        <X width={"15px"} height={"15px"} color={"red"} />
                      )
                    }
                  >
                    <Text size={"sm"}>Min. 8 Characters</Text>
                  </List.Item>

                  <List.Item
                    icon={
                      passwordValidation.hasUppercase ? (
                        <Check width={"15px"} height={"15px"} color={"green"} />
                      ) : (
                        <X width={"15px"} height={"15px"} color={"red"} />
                      )
                    }
                  >
                    <Text size={"sm"}>Min. 1 Uppercase</Text>
                  </List.Item>

                  <List.Item
                    icon={
                      passwordValidation.hasLowercase ? (
                        <Check width={"15px"} height={"15px"} color={"green"} />
                      ) : (
                        <X width={"15px"} height={"15px"} color={"red"} />
                      )
                    }
                  >
                    <Text size={"sm"}>Min. 1 Lowercase</Text>
                  </List.Item>

                  <List.Item
                    icon={
                      passwordValidation.hasDigit ? (
                        <Check width={"15px"} height={"15px"} color={"green"} />
                      ) : (
                        <X width={"15px"} height={"15px"} color={"red"} />
                      )
                    }
                  >
                    <Text size={"sm"}>Min. 1 Numeric</Text>
                  </List.Item>

                  <List.Item
                    icon={
                      passwordValidation.hasSpecialChar ? (
                        <Check width={"15px"} height={"15px"} color={"green"} />
                      ) : (
                        <X width={"15px"} height={"15px"} color={"red"} />
                      )
                    }
                  >
                    <Text size={"sm"}>Special Character</Text>
                  </List.Item>
                </Container>
              </List>
            </Container>
          </InputWrapper>

          <Button
            size={"md"}
            leftIcon={<LockOpen />}
            type={"submit"}
            loading={signingUp}
          >
            Sign Up
          </Button>

          <Text align={"center"}>
            Already have an account?&nbsp;
            <Text variant={"link"} component={"a"} href={"/auth/sign-in"}>
              Sign in.
            </Text>
          </Text>
        </Container>
      </Center>

      <Modal
        opened={openVerifyEmailModal}
        withCloseButton={false}
        onClose={() => setOpenVerifyEmailModal(true)}
        title={"Verify Email"}
      >
        <Container
          p={0}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gridGap: "8px",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              color: theme.colors.green[0],
              backgroundColor: theme.colors.green[8],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check width={"30px"} height={"30px"} />
          </div>

          <Text
            size={"sm"}
            style={{
              width: "calc(100% - 50px)",
            }}
          >
            We have sent an email verification link to your email ID. Please
            click on the link to verify your account.
          </Text>
        </Container>

        <Container>
          <Text align={"center"} color={"red"} size={"sm"}>
            Note: The verification link expires in 4h.
          </Text>

          <Container
            mt={"sm"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onClick={redirectToLogin}>Okay, got it!</Button>
          </Container>
        </Container>
      </Modal>
    </>
  );
};

export default SignUpPage;
