import { ConfigState } from "@/types/redux/slices/config";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ConfigState = {
  openAIKey: "",
};

export const configSlice = createSlice({
  name: "configSlice",
  initialState,
  reducers: {
    hydrateConfig: (
      state,
      action: PayloadAction<{
        openAIKey: string;
      }>
    ) => {
      state.openAIKey = action.payload.openAIKey;
    },
    updateConfig: (
      state,
      action: PayloadAction<{
        openAIKey: string;
      }>
    ) => {
      state.openAIKey = action.payload.openAIKey;
    },
  },
});

export const { hydrateConfig, updateConfig } = configSlice.actions;
