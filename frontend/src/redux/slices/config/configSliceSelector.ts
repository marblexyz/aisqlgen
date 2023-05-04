import { AppState } from "@/redux/store";

export const selectOpenAIKey = (state: AppState) => state.configState.openAIKey;
