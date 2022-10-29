import { Heading, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
}

const Heading2: FC<Props> = ({ text, textTransform }) => {
  return (
    <Heading
      as="h2"
      size="lg"
      px={4}
      textAlign={"center"}
      noOfLines={2}
      color={useColorModeValue("gray.700", "white")}
      textTransform={textTransform}
    >
      {text}
    </Heading>
  );
};

export default Heading2;
