import { GenerateSQLQueryResult } from "@/pages/api/query";
import { Query } from "@/types/redux/slices/queryHistory";
import { DatabaseSchemaObject, SampleRowsObject } from "@/types/schema";
import { HttpMethod, callServerlessApi } from ".";

export type GenerateSQLQueryConfig = {
  userQuestion: string;
  query?: string;
  dbSchema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
  previousQueries?: Query[];
};

export const generateSQLQuery = async ({
  userQuestion,
  query,
  dbSchema,
  sampleRows,
  sequential,
  previousQueries,
}: GenerateSQLQueryConfig) => {
  const response = await callServerlessApi(
    "/api/query",
    HttpMethod.POST,
    JSON.stringify({
      userQuestion,
      previousQueries,
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
