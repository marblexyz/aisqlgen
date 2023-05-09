import { getSampleData } from "@/handlers/db/sample";
import { Datasource } from "@/types/redux/slices/datasource";
import { useQuery } from "@tanstack/react-query";

export type UseSampleRowsInTableInfo = {
  datasource?: Datasource;
  sampleRowsInTableInfo?: number;
  enabled?: boolean;
};

export const useGetSchema = ({
  datasource,
  sampleRowsInTableInfo,
}: UseSampleRowsInTableInfo) => {
  const resourceName = datasource?.config.resourceName;
  const queryResult = useQuery({
    queryKey: ["samplePostgresData", resourceName, sampleRowsInTableInfo ?? 0],
    queryFn: async () => {
      if (datasource?.config === undefined) {
        throw new Error("Datasource config is undefined.");
      }
      const data = await getSampleData({
        config: datasource.config,
        sampleRowsInTableInfo,
      });
      if (data.error !== undefined) {
        throw new Error(`Error getting sample data. ${data.error}`);
      }
      return data;
    },
  });
  return queryResult;
};
