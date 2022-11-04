import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import type { FC } from "react";

const SIGNIN_LINK = "/api/auth/login";

const SignInButton: FC = () => {
  return (
    <Button
      as={NextLink}
      fontSize={"sm"}
      fontWeight={600}
      variant={"link"}
      href={SIGNIN_LINK}
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
