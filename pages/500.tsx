import { Button, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";
import Heading1 from "../src/components/common/Heading1";
import Heading2 from "../src/components/common/Heading2";

interface Props {}

const Custom500: FC<Props> = (props) => {
  return (
    <VStack justifyContent={"center"} mt={16} gap={16}>
      <Heading1 text={"Oops. This shouldn't have happened."} />
      <Heading2 text={"500 Internal Server Error"} />
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

export default Custom500;
