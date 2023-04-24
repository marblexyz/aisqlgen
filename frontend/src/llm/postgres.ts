type GetPostgresPromptConfig = {
  input: string;
  tableInfo: string;
  topK?: number;
};

export const getPostgresPrompt = ({
  tableInfo,
  input,
  topK = 3,
}: GetPostgresPromptConfig) => {
  const PROMPT = `You are a PostgreSQL expert. Given an input question, first create a syntactically correct PostgreSQL query to run, then look at the results of the query and return the answer to the input question.
	  Unless the user specifies in the question a specific number of examples to obtain, query for at most ${topK} results using the LIMIT clause as per PostgreSQL. You can order the results to return the most informative data in the database.
	  Never query for all columns from a table. You must query only the columns that are needed to answer the question. Wrap each column name in double quotes (") to denote them as delimited identifiers.
	  Pay attention to use only the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, pay attention to which column is in which table.
	  
	  Use the following format:
	  
	  Question: "Question here"
	  SQLQuery: "SQL Query to run"
	  
	  Only use the following tables:
	  ${tableInfo}
	  
	  Question: ${input}`;
  return PROMPT;
};
