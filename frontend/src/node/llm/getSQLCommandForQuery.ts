import { DatasourceType } from "@/types/redux/slices/datasource";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import {
  getDbTypeFromDatasourceType,
  printPromptEncodingLength,
} from "../utils";
import { generateChatCompletion } from "./openai";

export type GetPromptConfig = {
  userQuestion: string;
  tableInfo: string;
  databaseType: string;
};

export const getSQLPrompt = ({
  tableInfo,
  userQuestion,
  databaseType,
}: GetPromptConfig) => {
  const PROMPT = `
You are a ${databaseType} expert. Given an input question, your goal is to create a syntactically correct ${databaseType} query to run.
You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
		
Only use the following tables:
${tableInfo}
		
Question: ${userQuestion}
Only return the SQL query in the answer. Do not include the question or any other text.`;
  return PROMPT;
};

export type GenerateSQLCommandForQueryConfig = {
  userQuestion: string;
  tableInfo: string;
  datasourceType: DatasourceType;
  openAIKey?: string;
};

export const generateSQLCommandForQuery = async ({
  userQuestion,
  tableInfo,
  openAIKey,
  datasourceType,
}: GenerateSQLCommandForQueryConfig) => {
  // TODO: Generalize this to work with any database type prompt
  const databaseType = getDbTypeFromDatasourceType(datasourceType);
  const commandPrompt = getSQLPrompt({ userQuestion, tableInfo, databaseType });
  printPromptEncodingLength(commandPrompt);
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: commandPrompt,
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
  return relevantTableNames;
};
