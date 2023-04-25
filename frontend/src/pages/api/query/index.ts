// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSQLCommandForQuery } from "@/node/llm/getSQLCommandForQuery";
import { getTablesToUseForQuery } from "@/node/llm/getTablesToUseForQuery";
import { DatabaseSchemaObject } from "@/types/schema";
import { getSchemaAsString } from "@/utils/getSchemaAsString";
import type { NextApiRequest, NextApiResponse } from "next";

export type GenerateSQLCommandBody = {
  query: string;
  dbSchema: DatabaseSchemaObject;
  sampleRows: Record<string, Record<string, unknown>[]>;
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

  const { query, dbSchema, sampleRows } = body as GenerateSQLCommandBody;

  const tableNames = Object.keys(dbSchema).join(", ");
  const validTableNames = Object.keys(dbSchema);

  try {
    const tableNameList = await getTablesToUseForQuery({
      query,
      tableNamesInfo: tableNames,
      validTableNames,
    });
    console.log(tableNameList);
    const tableSchemaAsString = getSchemaAsString(
      dbSchema,
      tableNameList,
      sampleRows
    );
    console.log(tableSchemaAsString);
    const result = await getSQLCommandForQuery({
      query,
      tableInfo: tableSchemaAsString,
    });
    console.log(result);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: "Error getting table list." });
  }
}
