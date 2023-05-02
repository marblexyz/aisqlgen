import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { queryHistorySlice } from "./slices/queryHistory/queryHistorySlice";
import { QueryHistory } from "@/types/redux/slices/queryHistory";
import { localForageStore } from "@/storage/storage-provider";
import { QueryMakerLocalStorageState } from "@/types/redux/state";

const saveToLocalStorage = async (state: QueryMakerLocalStorageState) => {
  try {
    const serialisedState = JSON.stringify(state.queryHistory);
    await localForageStore.setItem("queryHistory", serialisedState);
  } catch (e) {
    console.warn(e);
  }
};

export const loadFromlocalStorage =
  async (): Promise<QueryMakerLocalStorageState> => {
    try {
      const serialisedState = await localForageStore.getItem<string>(
        "queryHistory"
      );
      if (serialisedState === null) return { queryHistory: undefined };
      return { queryHistory: JSON.parse(serialisedState) as QueryHistory };
    } catch (e) {
      console.warn(e);
      return { queryHistory: undefined };
    }
  };

const makeStore = () => {
  return configureStore({
    reducer: {
      queryHistory: queryHistorySlice.reducer,
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
