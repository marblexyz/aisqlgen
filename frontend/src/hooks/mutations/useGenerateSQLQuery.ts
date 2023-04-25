import { generateSQLQuery } from "@/api/query";
import { DatabaseSchemaObject } from "@/types/schema";
import { useMutation } from "@tanstack/react-query";

export const useGenerateSQLQuery = (
  onSuccess?: (result: string | undefined) => void,
  onError?: (error: unknown) => void
) => {
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
    onSuccess: (result) => {
      if (onSuccess !== undefined) {
        onSuccess(result);
      }
    },
    onError: (error) => {
      if (onError !== undefined) {
        onError(error);
      }
    },
  });

  return mutationResult;
};
