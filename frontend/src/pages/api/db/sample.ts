// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient, getBasicDatabaseSchema } from "@/node/db/postgres";
import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

type Data = {
  error?: string;
  schema?: unknown;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const body = req.body;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
  }
  const config = {
    host: "localhost",
    port: 5434,
    database: "rizz_local",
    user: "postgres",
    password: "postgres",
    useSSL: true,
  };

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
