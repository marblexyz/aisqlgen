import { executeSQLQuery } from "@/handlers/db/execute";
import { Datasource } from "@/types/redux/slices/datasource";
import { DatabaseRow } from "@/types/schema";
import { useMutation } from "@tanstack/react-query";

export type ExecuteSQLQueryConfig = {
  query: string;
  datasource?: Datasource;
};
export const useExecuteSQLCommand = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: DatabaseRow[] | undefined) => void;
  onError?: (error: unknown) => void;
}) => {
  const mutationResult = useMutation({
    mutationKey: ["executeSQLQuery"],
    mutationFn: async ({ query, datasource }: ExecuteSQLQueryConfig) => {
      if (datasource?.config === undefined) {
        throw new Error("Datasource config is undefined.");
      }
      const result = await executeSQLQuery({
        query,
        config: datasource.config,
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
