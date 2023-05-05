import { PoolClient } from "pg";

export const executeQuery = async (poolClient: PoolClient, query: string) => {
  const result = await poolClient.query(query);
  return result.rows as Record<string, string>[];
};
