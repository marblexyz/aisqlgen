import { DatasourceMapState } from "./slices/datasource";
import { QueryHistory } from "./slices/queryHistory";

export type QueryMakerLocalStorageState = {
  queryHistory: QueryHistory | undefined;
  datasourceMap: DatasourceMapState | undefined;
};
