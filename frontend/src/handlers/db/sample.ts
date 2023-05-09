import { GetDBSchemaResult } from "@/types/api";
import { HttpMethod, callServerlessApi } from "..";
import { GetDBSchemaRequest } from "@/pages/api/db/schema";

export const getSampleData = async (requestBody: GetDBSchemaRequest) => {
  const body = JSON.stringify(requestBody);
  const response = await callServerlessApi(
    "/api/db/schema",
    HttpMethod.POST,
    body
  );
  if (response.status >= 400) {
    throw new Error("Error getting sample data.");
  }
  const data = (await response.json()) as GetDBSchemaResult;
  return data;
};
