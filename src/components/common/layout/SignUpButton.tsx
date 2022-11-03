import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import { FC } from "react";

const SIGNUP_LINK = "/api/auth/signup";

const SignUpButton: FC = () => {
  return (
    <Button
      as={NextLink}
      display={{ base: "none", md: "inline-flex" }}
      fontSize={"sm"}
      fontWeight={600}
      color={"white"}
      bg={"pink.400"}
      href={SIGNUP_LINK}
      _hover={{
        bg: "pink.300",
      }}
    >
      Sign Up
    </Button>
  );
};

export default SignUpButton;
