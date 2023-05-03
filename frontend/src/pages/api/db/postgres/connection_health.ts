// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPool } from "@/node/db/postgres";
import { CreatePGPoolConfig } from "@/types/schema";

import type { NextApiRequest, NextApiResponse } from "next";

export type CheckDBConnection = {
  config?: CreatePGPoolConfig | null | undefined;
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
  const { config } = body as CheckDBConnection;
  if (config === undefined || config === null) {
    res.status(400).json({ error: "DB config was not submitted." });
    return;
  }

  try {
    const pgPool = createPool(config);
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const poolClient = await pgPool.connect();
    try {
      await poolClient.query("SELECT NOW() as now");
    } finally {
      poolClient.release();
    }
    res.status(200).json({ isConnected: true });
  } catch (error) {
    res.status(401).json({ error: `${error}`, isConnected: false });
  }
}
