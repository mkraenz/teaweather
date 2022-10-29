import { Button, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";
import Heading1 from "../src/components/common/Heading1";

interface Props {}

/**
 * Bug: Nextjs is bitchy about error 404 using getServerSideProps to fix the dark mode flicker.
 * Related: https://github.com/i18next/next-i18next/issues/677
 * Original error message:
 * Error: `pages/404` can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props
 */
const Custom404: FC<Props> = (props) => {
  return (
    <VStack justifyContent={"center"} mt={16} gap={16}>
      <Heading1 text={"404 Page Not Found"} />
      <Button
        as={NextLink}
        href={"/"}
        display={{ base: "none", md: "inline-flex" }}
        fontSize={"sm"}
        fontWeight={600}
        color={"white"}
        bg={"pink.400"}
        _hover={{
          bg: "pink.300",
        }}
      >
        Return to Home
      </Button>
    </VStack>
  );
};

export default Custom404;
