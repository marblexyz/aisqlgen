export type Query = {
  userQuestion: string;
  query: string;
  timestamp: number;
};

export type QueryHistory = {
  queries: Query[];
};
