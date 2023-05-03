import { PoolClient } from "pg";

export const executeQuery = async (poolClient: PoolClient, query: string) => {
  try {
    const result = await poolClient.query(query);
    return result.rows as Record<string, string>[];
  } catch (error) {
    console.error(error);
    throw new Error(`Error executing query ${query}.`);
  }
};
