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
  openAIKey?: string;
};

export const generateSQLQuery = async ({
  userQuestion,
  query,
  dbSchema,
  sampleRows,
  sequential,
  previousQueries,
  openAIKey,
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
      openAIKey,
    })
  );
  if (response.status >= 400) {
    const data = (await response.json()) as GenerateSQLQueryResult;
    throw new Error(`error while generating SQL query: ${data.error}`);
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

export const executeSQLQuery = async ({
  query,
  config,
}: ExecuteSQLQueryConfig) => {
  const response = await callServerlessApi(
    "/api/query/execute",
    HttpMethod.POST,
    JSON.stringify({
      query,
      config,
    })
  );
  if (response.status >= 400) {
    const data = (await response.json()) as ExecuteSQLQueryResult;
    throw new Error(data.error);
  }
  const data = (await response.json()) as ExecuteSQLQueryResult;
  return data.result;
};
