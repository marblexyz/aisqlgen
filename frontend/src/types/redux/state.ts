import { QueryHistory } from "./slices/queryHistory";

export type QueryMakerLocalStorageState = {
  queryHistory: QueryHistory | undefined;
};
