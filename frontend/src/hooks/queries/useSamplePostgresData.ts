import { getSampleData } from "@/api/sample";
import { useQuery } from "@tanstack/react-query";

export type UseSamplePostgresData = {
  enabled?: boolean;
};
export const useSamplePostgresData = ({
  enabled = false,
}: UseSamplePostgresData) => {
  const queryResult = useQuery({
    queryKey: ["samplePostgresData"],
    queryFn: async () => {
      const data = await getSampleData();
      return data;
    },
    enabled,
  });

  return queryResult;
};
