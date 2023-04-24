import { GenerateSQLQueryResult } from "@/pages/api/query";
import { DatabaseSchemaObject } from "@/types/schema";
import { HttpMethod, callServerlessApi } from ".";

export type GenerateSQLQueryConfig = {
  query: string;
  dbSchema?: DatabaseSchemaObject;
};

export const generateSQLQuery = async ({
  query,
  dbSchema,
}: GenerateSQLQueryConfig) => {
  const response = await callServerlessApi(
    "/api/query",
    HttpMethod.POST,
    JSON.stringify({
      query,
      dbSchema,
    })
  );
  if (response.status >= 400) {
    throw new Error("Error getting sample data.");
  }
  const data = (await response.json()) as GenerateSQLQueryResult;
  return data.result;
};
