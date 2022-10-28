import type { GetServerSidePropsContext, PreviewData } from "next";
import type { ParsedUrlQuery } from "querystring";

/**
 * WORKAROUND: This fixes flickering of the screen on initial render when using dark mode (we default to light mode).
 * Reexport this in pages that do not define their own getServerSideProps.
 * Solution based on https://blog.gshahdev.com/dark-mode-support-with-chakra-ui-and-nextjs
 * https://github.com/chakra-ui/chakra-ui/issues/6192
 * https://github.com/chakra-ui/chakra-ui/issues/6211
 * and https://chakra-ui.com/docs/styled-system/color-mode
 */
export const colorWorkaroundGetServerSideProps = (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const cookies = context.req?.headers.cookie ?? "";
  return {
    props: {
      cookies,
    },
  };
};
