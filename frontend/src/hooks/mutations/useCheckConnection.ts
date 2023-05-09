import { checkConnection } from "@/handlers/db/connection_health";
import { Datasource } from "@/types/redux/slices/datasource";
import { useMutation } from "@tanstack/react-query";

export const useCheckConnection = () => {
  const mutationResult = useMutation({
    mutationKey: ["checkConnection"],
    mutationFn: async (datasource: Datasource) => {
      const result = await checkConnection({ config: datasource.config });
      return result;
    },
  });
  return mutationResult;
};
