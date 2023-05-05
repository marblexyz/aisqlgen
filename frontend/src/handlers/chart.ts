import { GenerateChartResult } from "@/pages/api/chart";
import { HttpMethod, callServerlessApi } from ".";

export type GenerateChartCodeConfig = {
  data: string;
  chartRequest: string;
  scriptId: string;
  canvasId: string;
  model?: string;
  openAIKey?: string;
};

export const generateChartCode = async ({
  data,
  scriptId,
  canvasId,
  chartRequest,
  model,
  openAIKey,
}: GenerateChartCodeConfig) => {
  const response = await callServerlessApi(
    "/api/chart",
    HttpMethod.POST,
    JSON.stringify({
      data,
      scriptId,
      canvasId,
      chartRequest,
      model,
      openAIKey,
    })
  );
  if (response.status >= 400) {
    const resp = (await response.json()) as GenerateChartResult;
    throw new Error(resp.error);
  }
  const resp = (await response.json()) as GenerateChartResult;
  return resp.chartCode;
};
