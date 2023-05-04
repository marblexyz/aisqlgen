import { ExecutionLogItem } from "@/types/api";
import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { printPromptEncodingLength } from "../utils";
import { generateChatCompletion } from "./openai";

export type GetPostgresPromptConfig = {
  userQuestion: string;
  query: string;
  tableInfo: string;
  previousQueries?: ExecutionLogItem[];
};

const getPostgresPrompt = ({
  tableInfo,
  query,
  userQuestion,
  previousQueries = [],
}: GetPostgresPromptConfig) => {
  const previousQueriesToString = previousQueries
    .map((previousQuery) => {
      return `Question: ${previousQuery.userQuestion} \n Query: ${previousQuery.command} \n`;
    })
    .join("\n");

  const PROMPT = `
You are a PostgreSQL expert. Given an input question, your goal is to create a syntactically correct PostgreSQL query to run by modifying an existing query.
You can order the results to return the most informative data in the database.
Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
		
Only use the following tables:
${tableInfo}

${
  previousQueriesToString !== ""
    ? `Previous Queries: \n ${previousQueriesToString}`
    : ""
}
Existing Query: ${query}
Modification request: ${userQuestion}
Only return the SQL query in the answer. Do not include the question or any other text.`;
  return PROMPT;
};

export type EditSQLCommandForQueryConfig = {
  userQuestion: string;
  tableInfo: string;
  query: string;
  previousQueries?: ExecutionLogItem[];
  openAIAPIKey?: string;
};

export const editSQLCommandForQuery = async ({
  userQuestion,
  query,
  tableInfo,
  previousQueries,
  openAIAPIKey,
}: EditSQLCommandForQueryConfig) => {
  // TODO: Generalize this to work with any database type prompt
  const psqlCmdPrompt = getPostgresPrompt({
    userQuestion,
    query,
    tableInfo,
    previousQueries,
  });
  printPromptEncodingLength(psqlCmdPrompt);
  const messages = [
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: psqlCmdPrompt,
    },
  ];
  try {
    const result = await generateChatCompletion({
      openAIAPIKey,
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
  } catch (error) {
    console.error(error);
    throw new Error("Error getting tables to use for query.");
  }
};
