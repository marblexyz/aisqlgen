import { getSamplePGData } from "@/handlers/postgres/sample";
import { Datasource } from "@/types/redux/slices/datasource";
import { useQuery } from "@tanstack/react-query";

export type UseSampleRowsInTableInfo = {
  sampleRowsInTableInfo?: number;
  datasource?: Datasource;
  enabled?: boolean;
};

export const useGetPostgresSchema = ({
  datasource,
  sampleRowsInTableInfo,
}: UseSampleRowsInTableInfo) => {
  const pgConfig = datasource?.config;
  const resourceName = pgConfig?.resourceName ?? "sample";
  const queryResult = useQuery({
    queryKey: ["samplePostgresData", resourceName, sampleRowsInTableInfo ?? 0],
    queryFn: async () => {
      if (datasource === undefined) {
        return {};
      }
      const data = await getSamplePGData({
        config: pgConfig,
        sampleRowsInTableInfo,
      });
      if (data.error !== undefined) {
        throw new Error("Error getting sample data.");
      }
      return data;
    },
  });

  return queryResult;
};
