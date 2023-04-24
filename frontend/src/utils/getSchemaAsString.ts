import { DatabaseSchemaObject } from "@/types/schema";

export const getSchemaAsString = (
  schema: DatabaseSchemaObject,
  tableNameList?: string[]
): string => {
  // Generate a string schema representation with the following format:
  // table_name: column_name (udt_name), column_name (udt_name), column_name(udt_name)
  const schemaString = Object.entries(schema).reduce(
    (acc, [tableName, tableSchema]) => {
      if (tableNameList === undefined || tableNameList.includes(tableName)) {
        const columnsString = tableSchema.columns.reduce(
          (acc: string, column: { name: string; columnType: string }) => {
            const columnString = `${column.name} (${column.columnType})`;
            return acc === "" ? columnString : `${acc}, ${columnString}`;
          },
          ""
        );
        return acc === ""
          ? `${tableName}: ${columnsString}`
          : `${acc}\n${tableName}: ${columnsString}`;
      } else {
        return acc;
      }
    },
    ""
  );
  return schemaString;
};
