export type PGColumnType = {
  name: string;
  columnType: string;
  isPrimaryKey?: boolean;
  foreignKey?: {
    referencedTableName: string;
    referencedColumnName: string;
  };
};

export type PGTableSchema = {
  tableName: string;
  columns: PGColumnType[];
};
export type DatabaseSchemaObject = Record<string, PGTableSchema>;

export type DatabaseRow = { [key: string]: unknown };

export type CreatePGPoolConfig = {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export type SampleRowsObject = Record<string, Record<string, unknown>[]>;
