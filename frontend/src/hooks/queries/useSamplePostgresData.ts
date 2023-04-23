import { getSampleData } from "@/api/sample";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type UseSamplePostgresData = {
  enabled?: boolean;
};
export const useSamplePostgresData = ({
  enabled = false,
}: UseSamplePostgresData) => {
  const queryResult = useQuery({
    queryKey: ["samplePostgresData"],
    queryFn: async () => {
      const data = await getSampleData();
      return data;
    },
    enabled,
  });

  const schemaString = useMemo(() => {
    if (queryResult.data === undefined) {
      return queryResult.data;
    }
    // Generate a string schema representation with the following format:
    // table_name: column_name (udt_name), column_name (udt_name), column_name(udt_name)
    const schemaString = Object.entries(queryResult.data).reduce(
      (acc, [tableName, tableSchema]) => {
        const columnsString = tableSchema.columns.reduce((acc, column) => {
          const columnString = `${column.name} (${column.columnType})`;
          return acc === "" ? columnString : `${acc}, ${columnString}`;
        }, "");
        return acc === ""
          ? `${tableName}: ${columnsString}`
          : `${acc}\n${tableName}: ${columnsString}`;
      },
      ""
    );
    return schemaString;
  }, [queryResult.data]);

  return { schemaString, ...queryResult };
};
