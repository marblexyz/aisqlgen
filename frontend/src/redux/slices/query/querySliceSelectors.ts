import { AppState } from "@/redux/store";

export const selectQuery = (id: string) => (state: AppState) => {
  return state.queryState.queries[id];
};

export const selectIds = (state: AppState) => {
  return state.queryState.ids;
};
