import { DatabaseSchemaObject, SampleRowsObject } from "./schema";

export type ExecutionLogItem = {
  userQuestion: string;
  command: string;
};

export type GetDBSchemaResult = {
  error?: string;
  schema?: DatabaseSchemaObject;
  sampleRows?: SampleRowsObject;
};
