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
    addDataSource: (
      state,
      action: PayloadAction<{
        datasourceId: string;
        datasourceType: DatasourceType;
        datasourceConfig: DatasourceConfigType;
      }>
    ) => {
      state.datasourceMap[action.payload.datasourceId] = {
        type: action.payload.datasourceType,
        config: action.payload.datasourceConfig,
      };
    },
  },
});

export const { hydrateDatasourceConnector, addDataSource } =
  datasourceConnector.actions;
