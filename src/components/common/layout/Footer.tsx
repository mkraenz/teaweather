import { Flex, Link, Text, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import type { FC } from "react";

interface Props {}

const Footer: FC<Props> = (props) => {
  return (
    <Flex pl={4}>
      <Text textColor={useColorModeValue("gray.600", "gray.400")}>
        <Link as={NextLink} href="/">
          Teaweather
        </Link>{" "}
        ©{" "}
        <Link as={NextLink} href="https://linktr.ee/mkraenz" isExternal>
          Mirco Kraenz
        </Link>{" "}
        2022.{" "}
        <Link as={NextLink} href="/privacy">
          Privacy Policy
        </Link>
        . Weather icons by{" "}
        <Link
          as={NextLink}
          href="https://www.amcharts.com/free-animated-svg-weather-icons/"
          isExternal
          referrerPolicy="no-referrer"
        >
          amCharts.com
        </Link>{" "}
        (no changes made).
      </Text>
    </Flex>
  );
};

export default Footer;
