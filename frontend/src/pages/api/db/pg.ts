// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  CreatePGClientConfig,
  createClient,
  getBasicDatabaseSchema,
} from "@/node/db/postgres";
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

type RequestType = {
  config: CreatePGClientConfig;
};

type Data = {
  error?: string;
  schema?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = req.body;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
  }
  const { config } = body as RequestType;

  let pgClient: Pool;
  try {
    pgClient = createClient(config);
    try {
      const databaseSchema = await getBasicDatabaseSchema(pgClient);
      res.status(200).json({ schema: databaseSchema });
    } catch (error) {
      res.status(500).json({ error: "Error getting database schema." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error creating pg client." });
  }
}
