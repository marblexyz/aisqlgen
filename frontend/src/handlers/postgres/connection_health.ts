import { Datasource } from "@/types/redux/slices/datasource";

export const checkPgConnection = async (datasource: Datasource) => {
  const { config } = datasource;
  const response = await fetch("/api/db/postgres/connection_health", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ config }),
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
