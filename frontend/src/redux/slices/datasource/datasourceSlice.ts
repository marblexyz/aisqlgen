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
    addDatasource: (
      state,
      action: PayloadAction<{
        id: string;
        type: DatasourceType;
        config: DatasourceConfigType;
      }>
    ) => {
      state.datasourceMap[action.payload.id] = {
        type: action.payload.type,
        config: action.payload.config,
      };
    },
  },
});

export const { hydrateDatasourceConnector, addDatasource } =
  datasourceConnector.actions;
