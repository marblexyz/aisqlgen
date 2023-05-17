import { DatasourceType } from "@/types/redux/slices/datasource";
import { encoding_for_model } from "@dqbd/tiktoken";

export const gpt4Encoding = encoding_for_model("gpt-4");

export const printPromptEncodingLength = (prompt: string) => {
  const promptEncoding = gpt4Encoding.encode(prompt);
  // eslint-disable-next-line no-console
  console.log(`Prompt encoding length: ${promptEncoding.length}`);
};

export function getDbTypeFromDatasourceType(datasourceType: DatasourceType) {
  switch (datasourceType) {
    case DatasourceType.Postgres:
      return "PostgreSQL";
    case DatasourceType.Sqlite:
      return "SQLite";
    case DatasourceType.ClickHouse:
      return "ClickHouse SQL";
    default:
      throw new Error("Invalid datasource type");
  }
}
