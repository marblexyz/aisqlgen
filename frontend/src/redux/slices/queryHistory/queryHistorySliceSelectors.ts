import { AppState } from "@/redux/store";

export const selectQueryHistory = (state: AppState) => state.queryHistory;
