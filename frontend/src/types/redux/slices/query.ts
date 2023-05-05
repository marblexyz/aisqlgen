import { DatabaseRow } from "@/types/schema";

export type ExecutionLog = {
  id: string;
  userQuestion: string;
  command: string;
  chartCode?: string;
  result?: DatabaseRow[];
  timestamp: number;
};

export type Query = {
  id: string;
  description: string;
  timestamp: number;
  dataSourceId: string | undefined;
  useFastMode: boolean;
  useSampleData: boolean;
  executionLog: Record<string, ExecutionLog>;
};

export type QueryState = {
  queries: Record<string, Query>;
  ids: string[];
};
