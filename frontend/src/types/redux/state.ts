import { DatasourceMap } from "./slices/datasource";
import { QueryHistory } from "./slices/queryHistory";

export type QueryMakerLocalStorageState = {
  queryHistory: QueryHistory | undefined;
};

export type DatasourceLocalStorageState = {
  datasourceMap: DatasourceMap | undefined;
};
