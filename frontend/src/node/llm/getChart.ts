import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { printPromptEncodingLength } from "../utils";
import { generateChatCompletion } from "./openai";

export type GetChartPromptConfig = {
  data: string;
  canvasId: string;
  scriptId: string;
  chartRequest: string;
};

export const getChartPrompt = ({
  data,
  canvasId,
  scriptId,
  chartRequest,
}: GetChartPromptConfig) => {
  // Possible errors:
  // 1. data gets redefined
  // 2.
  const PROMPT = `
Here's a snippet of data:
${data}

You are a chart.js V3 expert. Write chart.js code that visualizes the above data while following the following requirements:
${chartRequest}

Use ${scriptId} as the id for the script tag.
Use ${canvasId} as the id for the canvas tag.
Assume the data is already defined as 'const data = ' where data is an object. 
Do not define "data" in the code.
Only return the code that can be used in dangerouslySetInnerHTML in React with the following format. Do not include the question or any other text.
<div>
<canvas id="${canvasId}" width="800" height="400"></canvas>
<script id="${scriptId}">
</script>
</div>
	`;
  return PROMPT;
};

type GetChartConfig = {
  data: string;
  scriptId: string;
  canvasId: string;
  chartRequest: string;
  model?: string;
  openAIKey?: string;
};

export const getChart = async ({
  data,
  scriptId,
  canvasId,
  chartRequest,
  model = "gpt-3.5-turbo",
  openAIKey,
}: GetChartConfig) => {
  const prompt = getChartPrompt({
    data,
    scriptId,
    canvasId,
    chartRequest,
  });
  printPromptEncodingLength(prompt);
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: prompt,
    },
  ];
  try {
    const result = await generateChatCompletion({
      openAIKey,
      messages,
      temperature: 0,
      model,
    });
    if (result.data.choices.length === 0) {
      throw new Error("No choices returned from OpenAI");
    }
    const chartCode = result.data.choices[0].message?.content;
    if (chartCode === undefined) {
      throw new Error("No chart code returned from OpenAI");
    }
    // Clean
    const regex = /const data = [^\n;]*;/gm;
    const cleanedChartScript = chartCode.replace(regex, "");
    return cleanedChartScript;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting tables to use for query.");
  }
};
