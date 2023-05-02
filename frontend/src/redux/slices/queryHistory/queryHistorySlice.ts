import { QueryHistory } from "@/types/redux/slices/queryHistory";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: QueryHistory = {
  queries: [],
};

export const queryHistorySlice = createSlice({
  name: "queryHistorySlice",
  initialState,
  reducers: {
    hydrateQueryHistory: (state, action: PayloadAction<QueryHistory>) => {
      state.queries = action.payload.queries;
    },
    appendQuery: (
      state,
      action: PayloadAction<{
        userQuestion: string;
        query: string;
        timestamp: number;
      }>
    ) => {
      state.queries = [...state.queries, action.payload];
    },
  },
});

export const { appendQuery, hydrateQueryHistory } = queryHistorySlice.actions;
