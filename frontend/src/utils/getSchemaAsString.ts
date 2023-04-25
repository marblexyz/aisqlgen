import { DatabaseSchemaObject } from "@/types/schema";

export const getSchemaAsString = (
  schema: DatabaseSchemaObject,
  tableNameList?: string[],
  sampleRows?: Record<string, Record<string, unknown>[]>
): string => {
  // Generate a string schema representation with the following format:
  // table_name
  // column_name (udt_name), column_name (udt_name), column_name(udt_name)
  //
  // Optionally include sample rows:
  // table_name
  // column_name (udt_name), column_name (udt_name), column_name(udt_name)
  // column_value, column_value, column_value
  const schemaString = Object.entries(schema).reduce(
    (acc, [tableName, tableSchema]) => {
      if (tableNameList === undefined || tableNameList.includes(tableName)) {
        const columnsString = tableSchema.columns.reduce(
          (acc: string, column: { name: string; columnType: string }) => {
            const columnString = `${column.name} ${column.columnType}`;
            return acc === "" ? columnString : `${acc}, ${columnString}`;
          },
          ""
        );
        let tableInfoString = `Table: ${tableName}\n${columnsString}`;
        if (sampleRows !== undefined) {
          const sampleRowsString = sampleRows[tableName].reduce(
            (acc: string, row: Record<string, unknown>) => {
              const rowString = Object.entries(row).reduce(
                (acc: string, [_key, value]) => {
                  const valueString = `${
                    value !== undefined && value !== null
                      ? `${value.toString().trim().substring(0, 20)}`
                      : `NULL`
                  }`;
                  return acc === "" ? valueString : `${acc}, ${valueString}`;
                },
                ""
              );
              return acc === "" ? rowString : `${acc}\n${rowString}`;
            },
            ""
          );
          tableInfoString = `${tableInfoString}\n${sampleRowsString}`;
        }

        return acc === "" ? `${tableInfoString}` : `${acc}\n${tableInfoString}`;
      } else {
        return acc;
      }
    },
    ""
  );
  return schemaString;
};
