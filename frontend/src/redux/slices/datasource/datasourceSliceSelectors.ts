import { AppState } from "@/redux/store";

export const selectDatasourceMap = (state: AppState) =>
  state.datasource.datasourceMap;
