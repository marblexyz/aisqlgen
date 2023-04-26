// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  createPool,
  getBasicDatabaseSchema,
  getSampleRowsForTable,
} from "@/node/db/postgres";
import { SAMPLE_PG_DB_CONFIG } from "@/node/db/sample";
import {
  CreatePGPoolConfig,
  DatabaseSchemaObject,
  SampleRowsObject,
} from "@/types/schema";

import type { NextApiRequest, NextApiResponse } from "next";

export type GetDBSchemaRequest = {
  config?: CreatePGPoolConfig;
  sampleRowsInTableInfo?: number;
};

export type GetDBSchemaResult = {
  error?: string;
  schema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
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

  try {
    const pgPool = createPool(config ?? SAMPLE_PG_DB_CONFIG);
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const poolClient = await pgPool.connect();
    let databaseSchema: DatabaseSchemaObject;
    let sampleRows: SampleRowsObject | undefined;
    try {
      databaseSchema = await getBasicDatabaseSchema(poolClient);
      const tableNames = Object.keys(databaseSchema);

      if (sampleRowsInTableInfo !== undefined) {
        sampleRows = {};
        for (const tableName of tableNames) {
          sampleRows[tableName] = await getSampleRowsForTable(
            poolClient,
            tableName,
            sampleRowsInTableInfo
          );
        }
      }
    } finally {
      poolClient.release();
    }
    res.status(200).json({ schema: databaseSchema, sampleRows });
  } catch (error) {
    res.status(500).json({ error: "Error getting database schema." });
  }
}
