// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { editSQLCommandForQuery } from "@/node/llm/editSQLCommandForQuery";
import { generateSQLCommandForQuery } from "@/node/llm/getSQLCommandForQuery";
import { getTablesToUseForQuery } from "@/node/llm/getTablesToUseForQuery";
import { ExecutionLogItem } from "@/types/api";
import { DatabaseSchemaObject, SampleRowsObject } from "@/types/schema";
import { getSchemaAsString } from "@/utils/getSchemaAsString";
import type { NextApiRequest, NextApiResponse } from "next";

export type GenerateSQLCommandBody = {
  userQuestion: string;
  dbSchema: DatabaseSchemaObject;
  query?: string;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
  previousQueries?: ExecutionLogItem[];
  openAIKey?: string;
};

export type GenerateSQLQueryResult = {
  error?: string;
  result?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateSQLQueryResult>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = req.body;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  const {
    userQuestion,
    dbSchema,
    query,
    sampleRows,
    sequential,
    previousQueries,
    openAIKey,
  } = body as GenerateSQLCommandBody;

  const tableNames = Object.keys(dbSchema).join(", ");
  const validTableNames = Object.keys(dbSchema);

  try {
    let tableNameList: string[] | undefined;
    if (sequential === true) {
      tableNameList = await getTablesToUseForQuery({
        userQuestion,
        tableNamesInfo: tableNames,
        validTableNames,
        query,
        openAIKey,
      });
    }

    const tableSchemaAsString = getSchemaAsString(
      dbSchema,
      tableNameList,
      sampleRows
    );
    if (query === undefined) {
      const result = await generateSQLCommandForQuery({
        userQuestion,
        tableInfo: tableSchemaAsString,
        openAIKey,
      });
      res.status(200).json({ result });
      return;
    } else {
      const result = await editSQLCommandForQuery({
        userQuestion,
        tableInfo: tableSchemaAsString,
        query,
        previousQueries,
        openAIKey,
      });
      res.status(200).json({ result });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
    return;
  }
}
