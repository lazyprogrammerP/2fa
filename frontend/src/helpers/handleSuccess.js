import { showNotification } from "@mantine/notifications";

const handleSuccess = (response) => {
  if (response.data?.successMessage) {
    showNotification({
      message: response.data?.successMessage,
      color: "green",
    });
  }
};

export default handleSuccess;
