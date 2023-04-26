import { encoding_for_model } from "@dqbd/tiktoken";

export const gpt4Encoding = encoding_for_model("gpt-4");

export const printPromptEncodingLength = (prompt: string) => {
  const promptEncoding = gpt4Encoding.encode(prompt);
  // eslint-disable-next-line no-console
  console.log(`Prompt encoding length: ${promptEncoding.length}`);
};
