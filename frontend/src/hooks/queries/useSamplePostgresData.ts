import { getSampleData } from "@/api/sample";
import { useQuery } from "@tanstack/react-query";

export const useSamplePostgresData = (sampleRowsInTableInfo?: number) => {
  const queryResult = useQuery({
    queryKey: ["samplePostgresData"],
    queryFn: async () => {
      const data = await getSampleData({ sampleRowsInTableInfo });
      if (data.error !== undefined) {
        throw new Error("Error getting sample data.");
      }
      return data;
    },
  });

  return queryResult;
};
