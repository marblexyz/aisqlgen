import { checkPgConnection } from "@/handlers/postgres/connection_health";
import { Datasource } from "@/types/redux/slices/datasource";
import { useMutation } from "@tanstack/react-query";

export const useCheckPgConnection = () => {
  const mutationResult = useMutation({
    mutationKey: ["checkPgConnection"],
    mutationFn: async (datasource: Datasource) => {
      const result = await checkPgConnection(datasource);
      return result;
    },
  });
  return mutationResult;
};
