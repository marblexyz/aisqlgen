import { DATASOURCE_MAP, QUERY_STATE } from "@/storage/keys";
import { localForageStore } from "@/storage/storage-provider";
import { DatasourceMapState } from "@/types/redux/slices/datasource";
import { QueryState } from "@/types/redux/slices/query";
import { QueryMakerLocalStorageState } from "@/types/redux/state";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";
import { datasourceConnector } from "./slices/datasource/datasourceSlice";
import { queryStateSlice } from "./slices/query/querySlice";

const saveReduxStateToLocalStorage = async (
  state: QueryMakerLocalStorageState
) => {
  try {
    const serializedHistoryState = JSON.stringify(state.queryState);
    await localForageStore.setItem(QUERY_STATE, serializedHistoryState);
    const serializedDatasourceState = JSON.stringify(state.datasourceMapState);
    await localForageStore.setItem(DATASOURCE_MAP, serializedDatasourceState);
  } catch (e) {
    console.warn(e);
  }
};

export const loadReduxStateFromLocalStorage =
  async (): Promise<QueryMakerLocalStorageState> => {
    try {
      const queryHistorySerializedState =
        await localForageStore.getItem<string>(QUERY_STATE);
      const datasourceMapSerializedState =
        await localForageStore.getItem<string>(DATASOURCE_MAP);
      // TODO: Not exactly fault tolerant, but it's a start.
      if (
        queryHistorySerializedState === null ||
        datasourceMapSerializedState === null
      )
        return { datasourceMapState: undefined, queryState: undefined };

      return {
        queryState: JSON.parse(queryHistorySerializedState) as QueryState,
        datasourceMapState: JSON.parse(
          datasourceMapSerializedState
        ) as DatasourceMapState,
      };
    } catch (e) {
      console.warn(e);
      return { queryState: undefined, datasourceMapState: undefined };
    }
  };

const makeStore = () => {
  return configureStore({
    reducer: {
      queryState: queryStateSlice.reducer,
      datasourceMapState: datasourceConnector.reducer,
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
