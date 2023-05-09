export type SQLColumnType = {
  name: string;
  columnType: string;
  isPrimaryKey?: boolean;
  foreignKey?: {
    referencedTableName: string;
    referencedColumnName: string;
  };
};

export type SQLTableSchema = {
  tableName: string;
  columns: SQLColumnType[];
};
// tableName: SQLTableSchema
export type DatabaseSchemaMap = Map<string, SQLTableSchema>;
export type DatabaseSchemaObject = Record<string, SQLTableSchema>;

export type DatabaseRow = { [key: string]: unknown };

export type SampleRowsObject = Record<string, Record<string, unknown>[]>;
