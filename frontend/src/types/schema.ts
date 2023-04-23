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
