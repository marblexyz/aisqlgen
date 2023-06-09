import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { printPromptEncodingLength } from "../utils";
import { generateChatCompletion } from "./openai";

export type GetTablesToUsePromptConfig = {
  userQuestion: string;
  tableNames: string;
  query?: string;
};

export const getTablesToUsePrompt = ({
  userQuestion,
  tableNames,
  query,
}: GetTablesToUsePromptConfig) => {
  const PROMPT = `
  Given the below input question and list of potential tables, output a comma separated list of the table names that may be necessary to answer this question.
  
  Existing Query: ${query}

  Question: ${userQuestion}
  
  Table Names: ${tableNames}
  
  Only include the table names in the output, separated by commas. Do not include the question or any other text.
	`;
  return PROMPT;
};

type GetTablesToUseForQueryConfig = {
  tableNamesInfo: string;
  userQuestion: string;
  validTableNames: string[];
  query?: string;
  openAIKey?: string;
};

export const getTablesToUseForQuery = async ({
  tableNamesInfo,
  userQuestion,
  validTableNames,
  query,
  openAIKey,
}: GetTablesToUseForQueryConfig) => {
  const prompt = getTablesToUsePrompt({
    userQuestion,
    tableNames: tableNamesInfo,
    query,
  });
  printPromptEncodingLength(prompt);
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: prompt,
    },
  ];
  const result = await generateChatCompletion({
    openAIKey,
    messages,
    temperature: 0,
  });
  if (result.data.choices.length === 0) {
    throw new Error("No choices returned from OpenAI");
  }
  const relevantTableNames = result.data.choices[0].message?.content;
  if (relevantTableNames === undefined) {
    throw new Error("No relevant table names returned from OpenAI");
  }
  // Check the result to make sure it's a comma separated list of table names
  const tableNamesArray = relevantTableNames
    .split(",")
    .map((name) => name.trim());
  tableNamesArray.forEach((tableName) => {
    if (!validTableNames.includes(tableName)) {
      throw new Error(
        `Table name ${tableName} is not in the list of table names.`
      );
    }
  });
  return tableNamesArray;
};
