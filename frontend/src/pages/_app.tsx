import { hydrateConfig } from "@/redux/slices/config/configSlice";
import { hydrateDatasourceConnector } from "@/redux/slices/datasource/datasourceSlice";
import { hydrateQueryState } from "@/redux/slices/query/querySlice";
import store, { loadReduxStateFromLocalStorage } from "@/redux/store";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

const theme = extendTheme({
  fontSizes: {
    xs: "10px",
    sm: "12px",
    md: "14px",
  },
});

export default function App({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? "";
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
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns/dist/chartjs-adapter-date-fns.bundle.min.js"
        strategy="beforeInteractive"
      />
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
					window.dataLayer = window.dataLayer || [];
					function gtag(){dataLayer.push(arguments);}
					gtag('js', new Date());
					gtag('config', '${ANALYTICS_ID}', {
					page_path: window.location.pathname,
					});
				`,
        }}
      />
      <SessionProvider session={pageProps.session}>
        <ReduxProvider store={store}>
          <QueryClientProvider client={queryClient}>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </QueryClientProvider>
        </ReduxProvider>
      </SessionProvider>
    </>
  );
}
