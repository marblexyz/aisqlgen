import { CreatePGPoolConfig } from "./schema";

export type GetDBSchemaRequest = {
  config?: CreatePGPoolConfig;
};

export type GetDBSchemaResult = {
  error?: string;
  schema?: unknown;
};
