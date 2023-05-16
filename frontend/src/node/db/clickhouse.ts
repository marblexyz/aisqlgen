import { ClickHouseConnectionConfig } from "@/types/redux/slices/datasource";
import {
  DatabaseSchemaMap,
  DatabaseSchemaObject,
  SampleRowsObject,
} from "@/types/schema";
import { ClickHouseClient, createClient } from "@clickhouse/client";

export const createChClient = (config: ClickHouseConnectionConfig) => {
  try {
    const chClient = createClient(config);
    return chClient;
  } catch (error) {
    console.error(error);
    throw new Error(`Error creating clickhouse client: ${error}`);
  }
};

export const checkClickHouseConnection = async (
  config: ClickHouseConnectionConfig
) => {
  const chCLient = createChClient(config);
  try {
    await chCLient.ping();
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await chCLient.close();
  }
};

// Define an interface for schema information
type ClickhouseDatabaseSchema = {
  meta: [
    { name: "database"; type: "String" },
    { name: "table_name"; type: "String" },
    { name: "column_name"; type: "String" },
    { name: "data_type"; type: "String" },
    { name: "default_kind"; type: "String" },
    { name: "default_expression"; type: "String" },
    { name: "column_comment"; type: "String" }
  ];
  data: ClickhouseDatabaseSchemaRow[];
  rows: number;
  statistics: { elapsed: number; rows_read: number; bytes_read: number };
};

type ClickhouseDatabaseSchemaRow = {
  database: string;
  table_name: string;
  column_name: string;
  data_type: string;
  default_kind: string | null;
  default_expression: string | null;
  column_comment: string | null;
};

export const getBasicDatabaseSchema = async (
  chClient: ClickHouseClient,
  database: string
): Promise<DatabaseSchemaObject> => {
  const res = await chClient.query({
    query: `
	SELECT
	t.database,
	t.name AS table_name,
	c.name AS column_name,
	c.type AS data_type,
	c.default_kind AS default_kind,
	c.default_expression AS default_expression,
	c.comment AS column_comment
  FROM
	system.tables AS t
	JOIN system.columns AS c ON t.database = c.database AND t.name = c.table
  WHERE
	t.database = '${database}'
  ORDER BY
	t.name, c.name;
`,
  });
  const basicSchema = await res.json<ClickhouseDatabaseSchema>();
  // Convert basicSchema to DatabaseSchemaMap
  const schema: DatabaseSchemaMap = new Map();
  basicSchema.data.forEach((row) => {
    const tableSchema = schema.get(row.table_name);
    if (tableSchema) {
      tableSchema.columns.push({
        name: row.column_name,
        columnType: row.data_type,
      });
    } else {
      schema.set(row.table_name, {
        tableName: row.table_name,
        columns: [
          {
            name: row.column_name,
            columnType: row.data_type,
          },
        ],
      });
    }
  });
  return Object.fromEntries(schema);
};

export const getClickHouseSchema = async (
  config: ClickHouseConnectionConfig,
  sampleRowsInTableInfo?: number
) => {
  try {
    const chClient = createChClient(config);
    let databaseSchema: DatabaseSchemaObject;
    let sampleRows: SampleRowsObject | undefined;
    try {
      databaseSchema = await getBasicDatabaseSchema(chClient, config.database);
      const tableNameList = Object.keys(databaseSchema);
      sampleRows =
        sampleRowsInTableInfo !== undefined
          ? await getSampleRowsForSchema(
              chClient,
              sampleRowsInTableInfo,
              config.database,
              tableNameList
            )
          : undefined;
    } finally {
      await chClient.close();
    }
    return { schema: databaseSchema, sampleRows };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

type ClickhouseSampleRows = {
  meta: [{ name: "database"; type: "String" }];
  data: Record<string, unknown>[];
  rows: number;
  rows_before_limit_at_least: number;
  statistics: { elapsed: number; rows_read: number; bytes_read: number };
};
const getSampleRowsForTable = async (
  client: ClickHouseClient,
  database: string,
  tableName: string,
  sampleLimit = 3
) => {
  const query = `SELECT * FROM ${database}.${tableName} LIMIT ${sampleLimit}`;
  const sampleRowsResult = await client.query({ query });
  const sampleRows = await sampleRowsResult.json<ClickhouseSampleRows>();
  return sampleRows.data;
};

const getSampleRowsForSchema = async (
  chClient: ClickHouseClient,
  sampleRowsInTableInfo: number,
  database: string,
  tableNameList: string[]
) => {
  const sampleRows: SampleRowsObject | undefined = {};
  for (const tableName of tableNameList) {
    try {
      const res = await getSampleRowsForTable(
        chClient,
        database,
        tableName,
        sampleRowsInTableInfo
      );
      sampleRows[tableName] = res;
    } catch (error) {
      // Ignore error and continue
      console.error("Error getting sample rows for table", tableName, error);
    }
  }
  return sampleRows;
};

type ClickhouseQueryResult = {
  meta: [{ name: string; type: string }];
  data: Record<string, unknown>[];
  rows: number;
  rows_before_limit_at_least: number;
};

export const executeClickHouseQuery = async (
  config: ClickHouseConnectionConfig,
  query: string
) => {
  const chClient = createChClient(config);
  try {
    const res = await chClient.query({ query });
    const result = await res.json<ClickhouseQueryResult>();
    return result.data;
  } catch (error) {
    console.error(`Error executing query: ${query}`, error);
    throw error;
  } finally {
    await chClient.close();
  }
};
