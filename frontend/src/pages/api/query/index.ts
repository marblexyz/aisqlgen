// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { editSQLCommandForQuery } from "@/node/llm/editSQLCommandForQuery";
import { generateSQLCommandForQuery } from "@/node/llm/getSQLCommandForQuery";
import { getTablesToUseForQuery } from "@/node/llm/getTablesToUseForQuery";
import { Query } from "@/types/redux/slices/queryHistory";
import { DatabaseSchemaObject, SampleRowsObject } from "@/types/schema";
import { getSchemaAsString } from "@/utils/getSchemaAsString";
import type { NextApiRequest, NextApiResponse } from "next";

export type GenerateSQLCommandBody = {
  userQuestion: string;
  dbSchema: DatabaseSchemaObject;
  query?: string;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
  previousQueries?: Query[];
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = req.body;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
  }

  const {
    userQuestion,
    dbSchema,
    query,
    sampleRows,
    sequential,
    previousQueries,
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
      });
      res.status(200).json({ result });
    } else {
      const result = await editSQLCommandForQuery({
        userQuestion,
        tableInfo: tableSchemaAsString,
        query,
        previousQueries,
      });
      res.status(200).json({ result });
    }
  } catch (error) {
    res.status(500).json({ error: "Error getting table list." });
  }
}
