import { UserProvider } from "@auth0/nextjs-auth0";
import { ChakraProvider, cookieStorageManagerSSR } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Layout from "../src/components/common/layout/Layout";
import theme from "../src/components/common/layout/theme";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // pass `user` prop from pages that require server-side rendering to prepopulate the `useUser` hook.
  // do this via `maybeGetUser(..)` in getServerSideProps of the page
  const { user } = pageProps;

  return (
    <UserProvider user={user}>
      <ChakraProvider
        theme={theme}
        // To avoid initial flickering in dark mode / support SSR
        colorModeManager={cookieStorageManagerSSR(pageProps.cookies ?? "")}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </UserProvider>
  );
}
