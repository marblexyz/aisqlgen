import { DATASOURCE_MAP, QUERY_HISTORY } from "@/storage/keys";
import { localForageStore } from "@/storage/storage-provider";
import { DatasourceMapState } from "@/types/redux/slices/datasource";
import { QueryHistory } from "@/types/redux/slices/queryHistory";
import { QueryMakerLocalStorageState } from "@/types/redux/state";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { datasourceConnector } from "./slices/datasource/datasourceSlice";
import { queryHistorySlice } from "./slices/queryHistory/queryHistorySlice";

const saveReduxStateToLocalStorage = async (
  state: QueryMakerLocalStorageState
) => {
  try {
    const serializedHistoryState = JSON.stringify(state.queryHistory);
    await localForageStore.setItem(QUERY_HISTORY, serializedHistoryState);
    const serializedDatasourceState = JSON.stringify(state.datasourceMap);
    await localForageStore.setItem(DATASOURCE_MAP, serializedDatasourceState);
  } catch (e) {
    console.warn(e);
  }
};

export const loadReduxStateFromLocalStorage =
  async (): Promise<QueryMakerLocalStorageState> => {
    try {
      const queryHistorySerializedState =
        await localForageStore.getItem<string>(QUERY_HISTORY);
      const datasourceMapSerializedState =
        await localForageStore.getItem<string>(DATASOURCE_MAP);
      // TODO: Not exactly fault tolerant, but it's a start.
      if (
        queryHistorySerializedState === null ||
        datasourceMapSerializedState === null
      )
        return { datasourceMap: undefined, queryHistory: undefined };

      return {
        queryHistory: JSON.parse(queryHistorySerializedState) as QueryHistory,
        datasourceMap: JSON.parse(
          datasourceMapSerializedState
        ) as DatasourceMapState,
      };
    } catch (e) {
      console.warn(e);
      return { queryHistory: undefined, datasourceMap: undefined };
    }
  };

const makeStore = () => {
  return configureStore({
    reducer: {
      queryHistory: queryHistorySlice.reducer,
      datasourceMap: datasourceConnector.reducer,
    },
  });
};

const store = makeStore();

store.subscribe(() => void saveReduxStateToLocalStorage(store.getState()));

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
