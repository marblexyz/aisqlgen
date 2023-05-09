import {
  ExecuteQueryRequest,
  ExecuteSQLQueryResult,
} from "@/pages/api/db/execute";
import { HttpMethod, callServerlessApi } from "..";

export const executeSQLQuery = async ({
  query,
  config,
}: ExecuteQueryRequest) => {
  const response = await callServerlessApi(
    "/api/db/execute",
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
