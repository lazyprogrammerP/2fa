import { Center, Title } from "@mantine/core";
import Head from "next/head";
import { useEffect, useState } from "react";
import handleError from "../src/helpers/handleError";
import Server from "../src/Server";

export default function Home() {
  const [loadingUserData, setLoadingUserData] = useState(true);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    Server.get("/")
      .then((res) => {
        setUserData(res.data.userData);
        setLoadingUserData(false);
      })
      .catch((error) => {
        handleError(error, "Token Validation Error");
        setLoadingUserData(false);
      });
  }, []);

  return (
    <div>
      <Head>
        <title>2FA - Test App</title>
        <meta
          name={"description"}
          content={
            "Test application with a two-factor authentication functionality"
          }
        />
        {/* <link rel={"icon"} href={"/favicon.ico"} /> */}
      </Head>

      {userData && (
        <Center
          style={{
            width: "100%",
            height: "100vh",
          }}
        >
          <Title>
            Welcome, {userData.firstName} {userData.lastName}
          </Title>
        </Center>
      )}
    </div>
  );
}
