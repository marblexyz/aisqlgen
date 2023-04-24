type GetTablesToUsePromptConfig = {
  query: string;
  tableNames: string;
};

export const getTablesToUsePrompt = ({
  query,
  tableNames,
}: GetTablesToUsePromptConfig) => {
  const PROMPT = `
Given the below input question and list of potential tables, output a comma separated list of the table names that may be necessary to answer this question.

Question: ${query}

Table Names: ${tableNames}

Relevant Table Names:
  `;
  return PROMPT;
};
