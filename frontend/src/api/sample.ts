import { DatabaseSchemaObject } from "@/types/schema";
import { HttpMethod, callServerlessApi } from ".";

export type GetSampleData = {
  schema: DatabaseSchemaObject;
};

export const getSampleData = async () => {
  const response = await callServerlessApi("/api/db/pg", HttpMethod.POST);
  if (response.status >= 400) {
    throw new Error("Error getting sample data.");
  }
  const data = (await response.json()) as GetSampleData;
  return data.schema;
};
