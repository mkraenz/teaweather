import { Heading, useColorModeValue } from "@chakra-ui/react";
import type { FC } from "react";

interface Props {
  text: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
}

const Heading1: FC<Props> = ({ text, textTransform }) => {
  return (
    <Heading
      as="h1"
      size="4xl"
      noOfLines={1}
      color={useColorModeValue("gray.700", "white")}
      overflow="overflow"
      textTransform={textTransform}
    >
      {text}
    </Heading>
  );
};

export default Heading1;
