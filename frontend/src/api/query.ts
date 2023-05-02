import { GenerateSQLQueryResult } from "@/pages/api/query";
import { DatabaseSchemaObject, SampleRowsObject } from "@/types/schema";
import { HttpMethod, callServerlessApi } from ".";

export type GenerateSQLQueryConfig = {
  userQuestion: string;
  query?: string;
  dbSchema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
};

export const generateSQLQuery = async ({
  userQuestion,
  query,
  dbSchema,
  sampleRows,
  sequential,
}: GenerateSQLQueryConfig) => {
  const response = await callServerlessApi(
    "/api/query",
    HttpMethod.POST,
    JSON.stringify({
      userQuestion,
      query,
      dbSchema,
      sampleRows,
      sequential,
    })
  );
  if (response.status >= 400) {
    throw new Error("Error getting sample data.");
  }
  const data = (await response.json()) as GenerateSQLQueryResult;
  return data.result;
};
