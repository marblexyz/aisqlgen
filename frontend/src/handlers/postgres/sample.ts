import { GetDBSchemaRequest, GetDBSchemaResult } from "@/pages/api/db/postgres";
import { HttpMethod, callServerlessApi } from "..";

export const getSamplePGData = async (requestData?: GetDBSchemaRequest) => {
  const body = requestData ? JSON.stringify(requestData) : undefined;
  const response = await callServerlessApi(
    "/api/db/postgres",
    HttpMethod.POST,
    body
  );
  if (response.status >= 400) {
    throw new Error("Error getting sample data.");
  }
  const data = (await response.json()) as GetDBSchemaResult;
  return data;
};