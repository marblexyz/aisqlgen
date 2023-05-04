import { hydrateConfig } from "@/redux/slices/config/configSlice";
import { hydrateDatasourceConnector } from "@/redux/slices/datasource/datasourceSlice";
import { hydrateQueryState } from "@/redux/slices/query/querySlice";
import store, { loadReduxStateFromLocalStorage } from "@/redux/store";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

const theme = extendTheme({
  fontSizes: {
    xs: "10px",
    sm: "12px",
    md: "14px",
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  useEffect(() => {
    const hydrateReduxOnLoad = async () => {
      const preloadedReduxState = await loadReduxStateFromLocalStorage();
      if (
        preloadedReduxState.queryState !== undefined &&
        preloadedReduxState.queryState.ids.length > 0
      ) {
        store.dispatch(hydrateQueryState(preloadedReduxState.queryState));
      }
      if (preloadedReduxState.datasourceMapState !== undefined) {
        store.dispatch(
          hydrateDatasourceConnector(
            preloadedReduxState.datasourceMapState.datasourceMap
          )
        );
      }
      if (preloadedReduxState.configState !== undefined) {
        store.dispatch(hydrateConfig(preloadedReduxState.configState));
      }
    };
    void hydrateReduxOnLoad();
  }, []);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
