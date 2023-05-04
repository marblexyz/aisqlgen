import { GenerateSQLQueryResult } from "@/pages/api/query";
import { ExecutionLogItem } from "@/types/api";
import {
  CreatePGPoolConfig,
  DatabaseRow,
  DatabaseSchemaObject,
  SampleRowsObject,
} from "@/types/schema";
import { HttpMethod, callServerlessApi } from ".";

export type GenerateSQLQueryConfig = {
  userQuestion: string;
  query?: string;
  dbSchema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
  previousQueries?: ExecutionLogItem[];
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

export type ExecuteSQLQueryConfig = {
  query: string;
  config?: CreatePGPoolConfig;
};

export type ExecuteSQLQueryResult = {
  error?: string;
  result?: DatabaseRow[];
};

export const executeSQLQuery = async ({ query }: ExecuteSQLQueryConfig) => {
  const response = await callServerlessApi(
    "/api/query/execute",
    HttpMethod.POST,
    JSON.stringify({
      query,
    })
  );
  if (response.status >= 400) {
    throw new Error("Error executing query.");
  }
  const data = (await response.json()) as ExecuteSQLQueryResult;
  return data.result;
};
