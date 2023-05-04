import { ExecutionLog, QueryState } from "@/types/redux/slices/query";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const defaultQuery = {
  id: v4(),
  description: "",
  executionLog: {},
  dataSourceId: undefined,
  useFastMode: true,
  useSampleData: false,
  timestamp: Date.now(),
};

const initialState: QueryState = {
  queries: { [defaultQuery.id]: defaultQuery },
  ids: [defaultQuery.id],
};

export const queryStateSlice = createSlice({
  name: "queryStateSlice",
  initialState,
  reducers: {
    hydrateQueryState: (state, action: PayloadAction<QueryState>) => {
      state.queries = action.payload.queries;
      state.ids = action.payload.ids;
    },
    createQuery: (state) => {
      const newQuery = {
        id: v4(),
        description: "",
        dataSourceId: undefined,
        timestamp: Date.now(),
        executionLog: {},
        useFastMode: true,
        useSampleData: false,
      };
      state.queries = {
        ...state.queries,
        [newQuery.id]: newQuery,
      };
      state.ids = [newQuery.id, ...state.ids];
    },
    updateQuery: (
      state,
      action: PayloadAction<{
        id: string;
        description?: string;
        executionLog?: Record<string, ExecutionLog>;
        dataSourceId?: string;
        useFastMode?: boolean;
        useSampleData?: boolean;
      }>
    ) => {
      const {
        id,
        description,
        executionLog,
        dataSourceId,
        useFastMode,
        useSampleData,
      } = action.payload;
      const queryItem = state.queries[id];
      state.queries[id] = {
        ...queryItem,
        id,
        description:
          description === undefined ? queryItem.description : description,
        executionLog:
          executionLog === undefined ? queryItem.executionLog : executionLog,
        dataSourceId:
          dataSourceId === undefined ? queryItem.dataSourceId : dataSourceId,
        useFastMode:
          useFastMode === undefined ? queryItem.useFastMode : useFastMode,
        useSampleData:
          useSampleData === undefined ? queryItem.useSampleData : useSampleData,
      };
    },
    deleteQuery: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;
      delete state.queries[id];
      state.ids = state.ids.filter((key) => key !== id);
    },
    clearQueryHistory: (
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) => {
      const { id } = action.payload;
      state.queries[id] = {
        ...state.queries[id],
        executionLog: {},
      };
    },
  },
});

export const {
  createQuery,
  updateQuery,
  deleteQuery,
  hydrateQueryState,
  clearQueryHistory,
} = queryStateSlice.actions;
