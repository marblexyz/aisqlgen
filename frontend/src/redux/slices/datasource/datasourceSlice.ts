import {
  Datasource,
  DatasourceMap,
  DatasourceMapState,
  DatasourceType,
} from "@/types/redux/slices/datasource";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 } from "uuid";

const initialState: DatasourceMapState = {
  datasourceMap: {
    [v4()]: {
      type: DatasourceType.Sqlite,
      config: {
        type: DatasourceType.Sqlite,
        resourceName: "movies.sqlite",
        filename: "dataset/movies.sqlite",
      },
    },
  },
};

export const datasourceConnector = createSlice({
  name: "datasourceConnectorSlice",
  initialState,
  reducers: {
    hydrateDatasourceConnector: (
      state,
      action: PayloadAction<DatasourceMap>
    ) => {
      state.datasourceMap = action.payload;
      // backfill config to postgresConfig
      Object.entries(action.payload).map(([key, datasource]) => {
        if (datasource === undefined) return;
        state.datasourceMap[key] = {
          ...datasource,
        };
      });
    },
    upsertDatasource: (
      state,
      action: PayloadAction<
        {
          id: string;
        } & Datasource
      >
    ) => {
      const { id } = action.payload;
      state.datasourceMap[id] = {
        ...action.payload,
      };
    },
    deleteDatasource: (state, action: PayloadAction<string>) => {
      const { payload: id } = action;
      delete state.datasourceMap[id];
    },
  },
});

export const {
  hydrateDatasourceConnector,
  upsertDatasource,
  deleteDatasource,
} = datasourceConnector.actions;
