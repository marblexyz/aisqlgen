import { DataSource } from "@/components/page/index/DataSourceMenu";
import { DatabaseRow } from "@/types/schema";

export type ExecutionLog = {
  id: string;
  userQuestion: string;
  command: string;
  result?: DatabaseRow[];
  timestamp: number;
};

export type Query = {
  id: string;
  description: string;
  timestamp: number;
  dataSource: DataSource;
  useFastMode: boolean;
  useSampleData: boolean;
  executionLog: Record<string, ExecutionLog>;
};

export type QueryState = {
  queries: Record<string, Query>;
  ids: string[];
};
