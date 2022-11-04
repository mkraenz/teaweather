import { UserProvider, type Claims } from "@auth0/nextjs-auth0";
import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import type { GetServerSideProps, PreviewData } from "next";
import type { AppProps } from "next/app";
import type { ParsedUrlQuery } from "querystring";
import Layout from "../src/components/common/layout/Layout";
import theme from "../src/components/common/layout/theme";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps,
}: AppProps<CommonPageProps>) {
  // pass `user` prop from pages that require server-side rendering to prepopulate the `useUser` hook.
  // do this via `maybeGetUser(..)` in getServerSideProps of the page
  const { user, cookies } = pageProps;

  return (
    <UserProvider user={user || undefined}>
      <ChakraProvider
        theme={theme}
        // To avoid initial flickering in dark mode / support SSR
        colorModeManager={cookieStorageManagerSSR(cookies ?? "")}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </UserProvider>
  );
}

export type CommonPageProps = {
  cookies: string;
  user: Claims | null;
};

export type MyGetServerSideProps<
  P extends { [key: string]: any } = { [key: string]: any },
  Q extends ParsedUrlQuery = ParsedUrlQuery,
  D extends PreviewData = PreviewData
> = GetServerSideProps<P & CommonPageProps, Q, D>;
