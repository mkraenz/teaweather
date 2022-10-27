import { Text, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
  activePage: "home" | "privacy";
}

// TODO
const Navbar: FC<Props> = ({ activePage }) => {
  return (
    <Text textColor={useColorModeValue("gray.600", "gray.400")}>
      Currently on {activePage}
    </Text>
  );
};

export default Navbar;
