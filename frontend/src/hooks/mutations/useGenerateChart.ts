import { useMutation } from "@tanstack/react-query";
import { generateChartCode } from "@/handlers/chart";

export type GenerateSQLQueryConfig = {
  data: string;
  scriptId: string;
  canvasId: string;
  model?: string;
  chartRequest?: string;
  openAIKey?: string;
};

export const useGenerateChart = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: string | undefined) => void;
  onError?: (error: unknown) => void;
}) => {
  const mutationResult = useMutation({
    mutationKey: ["generateChart"],
    mutationFn: async ({
      data,
      scriptId,
      canvasId,
      model,
      chartRequest = "default",
      openAIKey,
    }: GenerateSQLQueryConfig) => {
      const result = await generateChartCode({
        data,
        scriptId,
        canvasId,
        model,
        chartRequest,
        openAIKey,
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
