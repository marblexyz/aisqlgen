import { ConfigState } from "./slices/config";
import { DatasourceMapState } from "./slices/datasource";
import { QueryState } from "./slices/query";

export type QueryMakerLocalStorageState = {
  queryState: QueryState | undefined;
  datasourceMapState: DatasourceMapState | undefined;
  configState: ConfigState | undefined;
};
