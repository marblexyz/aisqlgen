import { AppState } from "@/redux/store";

export const selectDatasourceMap = (state: AppState) =>
  state.datasourceMapState.datasourceMap;

export const selectDatasource =
  (datsourceId: string | undefined) => (state: AppState) =>
    datsourceId !== undefined
      ? state.datasourceMapState.datasourceMap[datsourceId]
      : undefined;
