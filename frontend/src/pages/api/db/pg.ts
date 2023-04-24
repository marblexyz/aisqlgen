// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPool, getBasicDatabaseSchema } from "@/node/db/postgres";
import { SAMPLE_PG_DB_CONFIG } from "@/node/db/sample";
import { CreatePGPoolConfig } from "@/types/schema";

import type { NextApiRequest, NextApiResponse } from "next";

export type GetDBSchemaRequest = {
  config?: CreatePGPoolConfig;
};

export type GetDBSchemaResult = {
  error?: string;
  schema?: unknown;
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
  const body = req.body;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
  }
  const { config } = body as GetDBSchemaRequest;

  try {
    const pgClient = createPool(config ?? SAMPLE_PG_DB_CONFIG);
    const databaseSchema = await getBasicDatabaseSchema(pgClient);
    res.status(200).json({ schema: databaseSchema });
  } catch (error) {
    res.status(500).json({ error: "Error getting database schema." });
  }
}
