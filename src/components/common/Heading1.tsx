import { Heading, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
}

const Heading1: FC<Props> = ({ text }) => {
  return (
    <Heading
      as="h1"
      size="4xl"
      noOfLines={1}
      color={useColorModeValue("gray.700", "white")}
    >
      {text}
    </Heading>
  );
};

export default Heading1;
