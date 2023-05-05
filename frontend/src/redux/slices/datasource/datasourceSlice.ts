import {
  DatasourceConfigType,
  DatasourceMap,
  DatasourceMapState,
  DatasourceType,
} from "@/types/redux/slices/datasource";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: DatasourceMapState = {
  datasourceMap: {},
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
    },
    upsertDatasource: (
      state,
      action: PayloadAction<{
        id: string;
        type: DatasourceType;
        config: DatasourceConfigType;
      }>
    ) => {
      const { id } = action.payload;
      state.datasourceMap[id] = {
        type: action.payload.type,
        config: action.payload.config,
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
