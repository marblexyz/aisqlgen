// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSQLCommandForQuery } from "@/node/llm/getSQLCommandForQuery";
import { getTablesToUseForQuery } from "@/node/llm/getTablesToUseForQuery";
import { DatabaseSchemaObject } from "@/types/schema";
import { getSchemaAsString } from "@/utils/getSchemaAsString";
import type { NextApiRequest, NextApiResponse } from "next";

export type GenerateSQLCommandBody = {
  query: string;
  dbSchema: DatabaseSchemaObject;
  sampleRows: unknown[];
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

  const { query, dbSchema } = body as GenerateSQLCommandBody;

  // Create a string with a list of possible table names with the format:
  // table1: column1 (primary key), column2 (foreign key, column3, ...
  // table2: column1, column2, column3, ...
  const tableNameInfo = Object.entries(dbSchema).reduce(
    (acc, [tableName, table]) => {
      // const columnList = table.columns.map((column) => column.name).join(", ");
      const columnList = table.columns.reduce((acc, column) => {
        const isPrimaryKey = column.isPrimaryKey ?? false;
        const fkData =
          column.foreignKey !== undefined
            ? ` (foreign key to ${column.foreignKey.referencedTableName}, ${column.foreignKey.referencedColumnName})`
            : "";
        const columnString = `${column.name} [${
          isPrimaryKey ? "(primary key)" : ""
        }${fkData} (${column.columnType})]`;
        return acc === "" ? columnString : `${acc}, ${columnString}`;
      }, "");
      return `${acc}${tableName}: ${columnList}\n`;
    },
    ""
  );
  const validTableNames = Object.keys(dbSchema);
  console.log("tableNames", tableNameInfo);
  console.log("validTableNames", validTableNames);
  try {
    const tableList = await getTablesToUseForQuery({
      query,
      tableNamesInfo: tableNameInfo,
      validTableNames,
    });
    console.log(tableList);
    const tableSchemaAsString = getSchemaAsString(dbSchema);
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
