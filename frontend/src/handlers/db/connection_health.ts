import { CheckDBConnectionRequest } from "@/pages/api/db/connection_health";

export const checkConnection = async (
  requestBody: CheckDBConnectionRequest
) => {
  const response = await fetch("/api/db/connection_health", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (response.status === 401) {
    const data = (await response.json()) as {
      error: string;
      isConnected: boolean;
    };
    throw new Error(data.error);
  }
  if (response.status >= 400) {
    throw new Error("Error checking connection.");
  }
  const data = (await response.json()) as { isConnected: boolean };
  return data;
};
