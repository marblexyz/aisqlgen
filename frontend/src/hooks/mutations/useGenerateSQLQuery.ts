import { generateSQLQuery } from "@/handlers/query";
import { ExecutionLogItem } from "@/types/api";
import { DatabaseSchemaObject, SampleRowsObject } from "@/types/schema";
import { useMutation } from "@tanstack/react-query";

export type GenerateSQLQueryConfig = {
  userQuestion: string;
  query?: string;
  dbSchema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
  sequential?: boolean;
  previousQueries?: ExecutionLogItem[];
};

export const useGenerateSQLQuery = (
  onSuccess?: (result: string | undefined) => void,
  onError?: (error: unknown) => void
) => {
  const mutationResult = useMutation({
    mutationKey: ["generateSQLQuery"],
    mutationFn: async ({
      userQuestion,
      query,
      dbSchema,
      sampleRows,
      sequential,
      previousQueries,
    }: GenerateSQLQueryConfig) => {
      const result = await generateSQLQuery({
        userQuestion,
        query,
        dbSchema,
        sampleRows,
        sequential,
        previousQueries,
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
