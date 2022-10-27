import { Heading, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
}

const Heading2: FC<Props> = ({ text }) => {
  return (
    <Heading
      as="h2"
      size="lg"
      noOfLines={1}
      color={useColorModeValue("gray.700", "white")}
    >
      {text}
    </Heading>
  );
};

export default Heading2;
