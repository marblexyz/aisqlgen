import { hydrateQueryHistory } from "@/redux/slices/queryHistory/queryHistorySlice";
import store, { loadFromlocalStorage } from "@/redux/store";
import { QueryMakerLocalStorageState } from "@/types/redux/state";
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
      const preloadedState: QueryMakerLocalStorageState =
        await loadFromlocalStorage();
      if (preloadedState.queryHistory !== undefined) {
        store.dispatch(hydrateQueryHistory(preloadedState.queryHistory));
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
