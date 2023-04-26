export type PGTableSchema = {
  tableName: string;
  columns: {
    name: string;
    columnType: string;
    isPrimaryKey?: boolean;
    foreignKey?: {
      referencedTableName: string;
      referencedColumnName: string;
    };
  }[];
};
export type DatabaseSchemaObject = Record<string, PGTableSchema>;

export type CreatePGPoolConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  useSSL?: boolean;
};

export type SampleRowsObject = Record<string, Record<string, unknown>[]>;
