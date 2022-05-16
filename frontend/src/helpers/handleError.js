import { showNotification } from "@mantine/notifications";

const handleError = (error, title) => {
  if (error.response?.status === 401) {
    return;
  }

  showNotification({
    title,
    message:
      error.response?.data?.errorMessage || "Something unexpected went wrong.",
    color: "red",
  });
};

export default handleError;
