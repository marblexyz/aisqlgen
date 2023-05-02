import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

export type GenerateChatCompletion = {
  messages: ChatCompletionRequestMessage[];
  temperature?: number;
  topP?: number;
};
export const generateChatCompletion = async ({
  messages,
  temperature = 0,
  topP = undefined,
}: GenerateChatCompletion) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (OPENAI_API_KEY === undefined) {
    throw new Error("OPENAI_API_KEY is undefined");
  }
  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: messages,
    temperature: temperature,
    top_p: topP,
    n: 1,
  });
  return response;
};
