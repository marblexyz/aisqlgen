import { generateSQLQuery } from "@/api/query";
import { DatabaseSchemaObject, SampleRowsObject } from "@/types/schema";
import { useMutation } from "@tanstack/react-query";

export type GenerateSQLQueryConfig = {
  query: string;
  dbSchema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
};
export const useGenerateSQLQuery = (
  onSuccess?: (result: string | undefined) => void,
  onError?: (error: unknown) => void
) => {
  const mutationResult = useMutation({
    mutationKey: ["generateSQLQuery"],
    mutationFn: async ({
      query,
      dbSchema,
      sampleRows,
      sequential,
    }: GenerateSQLQueryConfig) => {
      const result = await generateSQLQuery({
        query,
        dbSchema,
        sampleRows,
        sequential,
      });
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
