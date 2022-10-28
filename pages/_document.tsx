import { ColorModeScript } from "@chakra-ui/react";
import { Head, Html, Main, NextScript } from "next/document";
import theme from "../src/components/common/layout/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        {/* for chakra ui light/dark mode support with nextjs SSR */}
        {/* TODO stop flickering via https://github.com/chakra-ui/chakra-ui/issues/6192 and https://github.com/chakra-ui/chakra-ui/issues/6211 */}
        <ColorModeScript
          initialColorMode={theme.config.initialColorMode}
          type="cookie"
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
