import { generateSQLQuery } from "@/api/query";
import { DatabaseSchemaObject } from "@/types/schema";
import { useMutation } from "@tanstack/react-query";

export const useGenerateSQLQuery = () => {
  const mutationResult = useMutation({
    mutationKey: ["generateSQLQuery"],
    mutationFn: async ({
      query,
      dbSchema,
    }: {
      query: string;
      dbSchema?: DatabaseSchemaObject;
    }) => {
      const result = await generateSQLQuery({ query, dbSchema });
      return result;
    },
  });

  return mutationResult;
};
