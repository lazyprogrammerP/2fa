import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect } from "react";
import inactivityCheck from "../src/helpers/inactivityCheck";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // window.on = () => {
    // alert("Loaded");
    inactivityCheck();
    // };
  }, []);

  return (
    <MantineProvider
      theme={{
        fontFamily: "Montserrat, sans-serif",
        fontFamilyMonospace: "Monaco, Courier, monospace",
        headings: { fontFamily: "Greycliff CF, sans-serif" },
        fontSizes: {
          xl: "18px",
          lg: "16px",
          md: "14px",
          sm: "12px",
        },
      }}
    >
      <NotificationsProvider>
        <Component {...pageProps} />
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default MyApp;
