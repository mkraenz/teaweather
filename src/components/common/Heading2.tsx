import { Heading, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  text: string;
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  as?: "h1" | "h2";
}

const Heading2: FC<Props> = ({ text, textTransform, as = "h2" }) => {
  return (
    <Heading
      as={as}
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
