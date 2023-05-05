import { getChart } from "@/node/llm/getChart";
import { NextApiRequest, NextApiResponse } from "next";

export type GenerateChartRequest = {
  data: string;
  scriptId: string;
  canvasId: string;
  chartRequest: string;
  model?: string;
  openAIKey?: string;
};

export type GenerateChartResult = {
  error?: string;
  chartCode?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateChartResult>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { body } = req;
  if (body === undefined || body === null) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }
  const { data, scriptId, canvasId, openAIKey, model, chartRequest } =
    body as GenerateChartRequest;
  try {
    const chartCode = await getChart({
      data,
      scriptId,
      canvasId,
      openAIKey,
      model,
      chartRequest,
    });
    res.status(200).json({ chartCode });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
}
