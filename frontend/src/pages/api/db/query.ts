import { executeClickHouseQuery } from "@/node/db/clickhouse";
import { executePostgresQuery } from "@/node/db/postgres";
import { executeSqliteQuery } from "@/node/db/sqlite";
import {
  DatasourceConnectionConfig,
  DatasourceType,
} from "@/types/redux/slices/datasource";
import { DatabaseRow } from "@/types/schema";
import { NextApiRequest, NextApiResponse } from "next";

export type ExecuteQueryRequest = {
  query: string;
  config?: DatasourceConnectionConfig | undefined | null;
};

export type ExecuteSQLQueryResult = {
  error?: string;
  result?: DatabaseRow[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExecuteSQLQueryResult>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { body } = req;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }
  const { query, config } = body as ExecuteQueryRequest;
  if (config === undefined || config === null) {
    res.status(400).json({ error: "DB config was not submitted." });
    return;
  }
  try {
    switch (config.type) {
      case DatasourceType.Postgres: {
        const result = await executePostgresQuery(config, query);
        res.status(200).json({ result });
        break;
      }
      case DatasourceType.Sqlite: {
        const result = await executeSqliteQuery(config, query);
        res.status(200).json({ result });
        break;
      }
      case DatasourceType.ClickHouse: {
        const result = await executeClickHouseQuery(config, query);
        res.status(200).json({ result });
        break;
      }
      default:
        res.status(400).json({ error: "Unsupported DB type" });
    }
  } catch (error: Error | unknown) {
    res.status(500).json({ error: (error as Error).message });
  }
}
