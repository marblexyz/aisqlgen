import {
  GenerateSQLCommandRequest,
  GenerateSQLQueryResult,
} from "@/pages/api/query";
import { HttpMethod, callServerlessApi } from ".";

export const generateSQLQuery = async ({
  userQuestion,
  datasourceType,
  query,
  dbSchema,
  sampleRows,
  sequential,
  previousQueries,
  openAIKey,
}: GenerateSQLCommandRequest) => {
  const response = await callServerlessApi(
    "/api/query",
    HttpMethod.POST,
    JSON.stringify({
      userQuestion,
      datasourceType,
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
