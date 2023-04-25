import { GetDBSchemaRequest, GetDBSchemaResult } from "@/pages/api/db/pg";
import { HttpMethod, callServerlessApi } from ".";

export const getSampleData = async (requestData?: GetDBSchemaRequest) => {
  const body = requestData ? JSON.stringify(requestData) : undefined;
  const response = await callServerlessApi("/api/db/pg", HttpMethod.POST, body);
  if (response.status >= 400) {
    throw new Error("Error getting sample data.");
  }
  const data = (await response.json()) as GetDBSchemaResult;
  return data.schema;
};
