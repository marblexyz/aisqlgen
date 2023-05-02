import { DATASOURCE_MAP, QUERY_HISTORY } from "@/storage/keys";
import { localForageStore } from "@/storage/storage-provider";
import { DatasourceMap } from "@/types/redux/slices/datasource";
import { QueryHistory } from "@/types/redux/slices/queryHistory";
import {
  DatasourceLocalStorageState,
  QueryMakerLocalStorageState,
} from "@/types/redux/state";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { datasourceConnector } from "./slices/datasource/datasourceSlice";
import { queryHistorySlice } from "./slices/queryHistory/queryHistorySlice";

const saveToLocalStorage = async (state: QueryMakerLocalStorageState) => {
  try {
    const serializedState = JSON.stringify(state.queryHistory);
    await localForageStore.setItem("queryHistory", serializedState);
  } catch (e) {
    console.warn(e);
  }
};

export const loadQueryHistoryFromLocalStorage =
  async (): Promise<QueryMakerLocalStorageState> => {
    try {
      const serializedState = await localForageStore.getItem<string>(
        QUERY_HISTORY
      );
      if (serializedState === null) return { queryHistory: undefined };
      return { queryHistory: JSON.parse(serializedState) as QueryHistory };
    } catch (e) {
      console.warn(e);
      return { queryHistory: undefined };
    }
  };

export const loadDatasourceMapFromLocalStorage =
  async (): Promise<DatasourceLocalStorageState> => {
    try {
      const serializedState = await localForageStore.getItem<string>(
        DATASOURCE_MAP
      );
      if (serializedState === null) return { datasourceMap: undefined };
      return { datasourceMap: JSON.parse(serializedState) as DatasourceMap };
    } catch (e) {
      console.warn(e);
      return { datasourceMap: undefined };
    }
  };

const makeStore = () => {
  return configureStore({
    reducer: {
      queryHistory: queryHistorySlice.reducer,
      datasource: datasourceConnector.reducer,
    },
  });
};

const store = makeStore();

store.subscribe(() => void saveToLocalStorage(store.getState()));

export type ReduxStoreType = ReturnType<typeof makeStore>;

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
