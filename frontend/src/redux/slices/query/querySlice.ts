import { DataSource } from "@/components/page/index/DataSourceMenu";
import { ExecutionLog, QueryState } from "@/types/redux/slices/query";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const defaultQuery = {
  id: v4(),
  description: "",
  executionLog: {},
  dataSource: DataSource.SAMPLE,
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
        dataSource: DataSource.SAMPLE,
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
        dataSource?: DataSource;
        useFastMode?: boolean;
        useSampleData?: boolean;
      }>
    ) => {
      const {
        id,
        description,
        executionLog,
        dataSource,
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
        dataSource:
          dataSource === undefined ? queryItem.dataSource : dataSource,
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
      const index = state.ids.indexOf(id);
      state.queries[index] = {
        ...state.queries[index],
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
