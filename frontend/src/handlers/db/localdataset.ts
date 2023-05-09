import { GetLocalDatasetResult } from "@/pages/api/db/localdataset";

export const getLocalDatasets = async () => {
  const response = await fetch("/api/db/localdataset", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status === 401) {
    const data = (await response.json()) as {
      error: string;
      isConnected: boolean;
    };
    throw new Error(data.error);
  }
  if (response.status >= 400) {
    throw new Error("Error fetching dataset.");
  }
  const data = (await response.json()) as GetLocalDatasetResult;
  return data;
};
