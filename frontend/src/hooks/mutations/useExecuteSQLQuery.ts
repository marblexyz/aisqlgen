import { executeSQLQuery } from "@/handlers/query";
import { CreatePGPoolConfig, DatabaseRow } from "@/types/schema";
import { useMutation } from "@tanstack/react-query";

export type ExecuteSQLQueryConfig = {
  query: string;
  config?: CreatePGPoolConfig;
};
export const useExecuteSQLQuery = (
  onSuccess?: (result: DatabaseRow[] | undefined) => void,
  onError?: (error: unknown) => void
) => {
  const mutationResult = useMutation({
    mutationKey: ["executeSQLQuery"],
    mutationFn: async ({ query, config }: ExecuteSQLQueryConfig) => {
      const result = await executeSQLQuery({
        query,
        config,
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
