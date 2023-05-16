// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { checkClickHouseConnection } from "@/node/db/clickhouse";
import { checkPostgresConnection } from "@/node/db/postgres";
import { checkSqliteConnection } from "@/node/db/sqlite";
import {
  DatasourceConnectionConfig,
  DatasourceType,
} from "@/types/redux/slices/datasource";

import type { NextApiRequest, NextApiResponse } from "next";

export type CheckDBConnectionRequest = {
  config?: DatasourceConnectionConfig | null | undefined;
};

export type CheckDBConnectionResult = {
  error?: string;
  isConnected?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CheckDBConnectionResult>
) {
  // TODO: This should really be a GET request, but that will require
  // a database, UUIDs, etc.
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { body } = req;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
  }
  const { config } = body as CheckDBConnectionRequest;
  if (config === undefined || config === null) {
    res.status(400).json({ error: "DB config was not submitted." });
    return;
  }
  try {
    switch (config.type) {
      case DatasourceType.Postgres: {
        await checkPostgresConnection(config);
        res.status(200).json({ isConnected: true });
        break;
      }
      case DatasourceType.Sqlite: {
        await checkSqliteConnection(config);
        res.status(200).json({ isConnected: true });
        break;
      }
      case DatasourceType.ClickHouse: {
        await checkClickHouseConnection(config);
        res.status(200).json({ isConnected: true });
        break;
      }
    }
  } catch (error) {
    res.status(401).json({ error: `${error}`, isConnected: false });
  }
}
