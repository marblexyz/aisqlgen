import { executeQuery } from "@/node/db/execute";
import { createPool } from "@/node/db/postgres";
import { SAMPLE_PG_DB_CONFIG } from "@/node/db/sample";
import { CreatePGPoolConfig, DatabaseRow } from "@/types/schema";
import { NextApiRequest, NextApiResponse } from "next";

export type ExecuteQueryRequest = {
  query: string;
  config?: CreatePGPoolConfig;
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
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { body } = req;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
  }
  const { query, config } = body as ExecuteQueryRequest;
  try {
    const pgPool = createPool(config ?? SAMPLE_PG_DB_CONFIG);
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const poolClient = await pgPool.connect();
    try {
      const result = await executeQuery(poolClient, query);
      res.status(200).json({ result });
    } finally {
      poolClient.release();
    }
    // res.status(200).json({ schema: databaseSchema, sampleRows });
  } catch (error) {
    res.status(500).json({ error: "Error while executing query." });
  }
}
