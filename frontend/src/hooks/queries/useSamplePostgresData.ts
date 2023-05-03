import { getSamplePGData } from "@/handlers/postgres/sample";
import { useQuery } from "@tanstack/react-query";

export const useSamplePostgresData = (sampleRowsInTableInfo?: number) => {
  const queryResult = useQuery({
    queryKey: ["samplePostgresData", sampleRowsInTableInfo],
    queryFn: async () => {
      const data = await getSamplePGData({ sampleRowsInTableInfo });
      if (data.error !== undefined) {
        throw new Error("Error getting sample data.");
      }
      return data;
    },
  });

  return queryResult;
};
