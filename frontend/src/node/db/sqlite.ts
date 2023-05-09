import { SQLiteConnectionConfig } from "@/types/redux/slices/datasource";
import {
  DatabaseSchemaMap,
  DatabaseSchemaObject,
  SampleRowsObject,
} from "@/types/schema";
import { Database, open } from "sqlite";
import { Database as Sqlite3Database } from "sqlite3";

export const getSqliteSchema = async (
  config: SQLiteConnectionConfig,
  sampleRowsInTableInfo?: number
) => {
  try {
    const dbConn = await createConnection(config);
    let databaseSchema: DatabaseSchemaObject;
    let sampleRows: SampleRowsObject | undefined;
    try {
      databaseSchema = await getBasicDatabaseSchema(dbConn);
      const tableNames = Object.keys(databaseSchema);

      if (sampleRowsInTableInfo !== undefined) {
        sampleRows = {};
        for (const tableName of tableNames) {
          try {
            const res = await getSampleRowsForTable(
              dbConn,
              tableName,
              sampleRowsInTableInfo
            );
            sampleRows[tableName] = res;
          } catch {
            delete databaseSchema[tableName];
          }
        }
      }
    } finally {
      await dbConn.close();
    }
    return { schema: databaseSchema, sampleRows };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const checkSqliteConnection = async (config: SQLiteConnectionConfig) => {
  const conn = await createConnection(config);
  try {
    await conn.get("SELECT DATETIME()");
  } finally {
    await conn.close();
  }
};

export const executeSqliteQuery = async (
  config: SQLiteConnectionConfig,
  query: string
) => {
  const conn = await createConnection(config);
  return await conn.all<Record<string, string>[]>(query);
};

const createConnection = async (config: SQLiteConnectionConfig) => {
  const db = await open({
    filename: config.filename,
    driver: Sqlite3Database,
  });
  return db;
};

type DatabaseSchemaRow = {
  type: string;
  name: string;
  tbl_name: string;
  rootpage: number;
  sql: string;
};

const getBasicDatabaseSchema = async (
  conn: Database
): Promise<DatabaseSchemaObject> => {
  try {
    const databaseSchema = await conn.all<DatabaseSchemaRow[]>(`SELECT * FROM 
    (SELECT * FROM sqlite_schema UNION ALL
     SELECT * FROM sqlite_temp_schema)
 WHERE type='table'
 ORDER BY name;
 `);
    const schema: DatabaseSchemaMap = new Map();
    await Promise.all(
      databaseSchema.map(async (row) => {
        const columns = await conn.all<{ name: string; type: string }[]>(
          `SELECT name, type from pragma_table_info("${row.name}")`
        );
        schema.set(row.name, {
          tableName: row.name,
          columns: columns.map((column) => ({
            name: column.name,
            columnType: column.type,
          })),
        });
      })
    );
    return Object.fromEntries(schema);
  } catch (error) {
    console.error(error);
    throw new Error(`Error getting database schema.`);
  }
};

const getSampleRowsForTable = async (
  conn: Database,
  tableName: string,
  limit = 3
) => {
  const text = `SELECT * FROM ${tableName} LIMIT ${limit};`;

  try {
    const result = await conn.all(text);
    return result as Record<string, unknown>[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
