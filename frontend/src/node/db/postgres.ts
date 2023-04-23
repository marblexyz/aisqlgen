import { DatabaseSchemaObject, PGTableSchema } from "@/types/schema";
import { isNullOrUndefined } from "@/utils";
import { Pool } from "pg";

export type CreatePGClientConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  useSSL?: boolean;
};

export const createClient = (config: CreatePGClientConfig) => {
  const pool = new Pool(config);
  return pool;
};

type DatabaseSchemaRow = {
  table_name: string;
  column_name: string;
  udt_name: string;
};

type DatabaseRelationshipRow = {
  table_name: string;
  column_name: string;
  key_type: "pk" | "fk";
  referenced_table?: string;
  referenced_column?: string;
};

type DatabaseSchemaMap = Map<string, PGTableSchema>;

const DB_SCHEMA_QUERY = `
SELECT
    t.table_name,
    c.column_name,
    c.udt_name
FROM
    information_schema.tables AS t
JOIN
    information_schema.columns AS c
        ON t.table_schema = c.table_schema
        AND t.table_name = c.table_name
WHERE
    t.table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY
    t.table_schema,
    t.table_name,
    c.ordinal_position;
`;
const DB_RELATIONSHIPS_QUERY = `
SELECT
  tc.table_name,
  kcu.column_name,
  CASE
      WHEN tc.constraint_type = 'PRIMARY KEY' THEN 'pk'
      WHEN tc.constraint_type = 'FOREIGN KEY' THEN 'fk'
  END AS key_type,
  ccu.table_name AS referenced_table,
  ccu.column_name AS referenced_column
FROM
    information_schema.table_constraints AS tc
JOIN
    information_schema.key_column_usage AS kcu
        ON tc.constraint_catalog = kcu.constraint_catalog
        AND tc.constraint_schema = kcu.constraint_schema
        AND tc.constraint_name = kcu.constraint_name
LEFT JOIN
    information_schema.referential_constraints AS rc
        ON tc.constraint_catalog = rc.constraint_catalog
        AND tc.constraint_schema = rc.constraint_schema
        AND tc.constraint_name = rc.constraint_name
LEFT JOIN
    information_schema.constraint_column_usage AS ccu
        ON rc.unique_constraint_catalog = ccu.constraint_catalog
        AND rc.unique_constraint_schema = ccu.constraint_schema
        AND rc.unique_constraint_name = ccu.constraint_name
WHERE
    tc.table_schema = 'public'
    AND (tc.constraint_type = 'PRIMARY KEY' OR tc.constraint_type = 'FOREIGN KEY')
ORDER BY
    tc.table_schema,
    tc.table_name,
    key_type,
    kcu.column_name;
`;

export const getBasicDatabaseSchema = async (
  pool: Pool
): Promise<DatabaseSchemaObject> => {
  const databaseSchema = await pool.query<DatabaseSchemaRow>(DB_SCHEMA_QUERY);

  const databaseRelationships = await pool.query<DatabaseRelationshipRow>(
    DB_RELATIONSHIPS_QUERY
  );

  const schema: DatabaseSchemaMap = new Map();

  databaseSchema.rows.forEach((row) => {
    const tableSchema = schema.get(row.table_name);
    if (tableSchema) {
      tableSchema.columns.push({
        name: row.column_name,
        columnType: row.udt_name,
      });
    } else {
      schema.set(row.table_name, {
        tableName: row.table_name,
        columns: [
          {
            name: row.column_name,
            columnType: row.udt_name,
          },
        ],
      });
    }
  });
  databaseRelationships.rows.forEach((row) => {
    const tableSchema = schema.get(row.table_name);
    if (tableSchema) {
      const column = tableSchema.columns.find(
        (column) => column.name === row.column_name
      );
      if (column) {
        if (row.key_type === "pk") {
          column.isPrimaryKey = true;
        } else {
          if (
            isNullOrUndefined(row.referenced_column) ||
            isNullOrUndefined(row.referenced_table)
          ) {
            throw new Error(
              `Foreign key relationship is missing referenced column or table. Table: ${row.table_name}, Column: ${row.column_name}`
            );
          }
          column.foreignKey = {
            referencedColumnName: row.referenced_column,
            referencedTableName: row.referenced_table,
          };
        }
      }
    }
  });

  return Object.fromEntries(schema);
};
