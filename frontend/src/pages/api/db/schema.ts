// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getPostgresSchema } from "@/node/db/postgres";
import { getSqliteSchema } from "@/node/db/sqlite";
import { GetDBSchemaResult } from "@/types/api";
import {
  DatasourceConnectionConfig,
  DatasourceType,
} from "@/types/redux/slices/datasource";

import type { NextApiRequest, NextApiResponse } from "next";

export type GetDBSchemaRequest = {
  config?: DatasourceConnectionConfig | null | undefined;
  sampleRowsInTableInfo?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetDBSchemaResult>
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
  const { config, sampleRowsInTableInfo } = body as GetDBSchemaRequest;
  if (config === undefined || config === null) {
    res.status(400).json({ error: "DB config was not submitted." });
    return;
  }
  try {
    switch (config.type) {
      case DatasourceType.Postgres: {
        const responseBody = await getPostgresSchema(
          config,
          sampleRowsInTableInfo
        );
        res.status(200).json(responseBody);
        return;
      }
      case DatasourceType.Sqlite: {
        const responseBody = await getSqliteSchema(
          config,
          sampleRowsInTableInfo
        );
        res.status(200).json(responseBody);
        return;
      }
      default:
        res.status(400).json({ error: "Unsupported DB type." });
        return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
    return;
  }
}
