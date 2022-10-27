import { Link, Text, useColorModeValue } from "@chakra-ui/react";
import { FC } from "react";

interface Props {}

const Footer: FC<Props> = (props) => {
  return (
    <Text textColor={useColorModeValue("gray.600", "gray.400")}>
      <Link href="/">Teaweather</Link> ©{" "}
      <Link href="https://linktr.ee/mkraenz">Mirco Kraenz</Link> 2022.{" "}
      <Link href="/privacy">Privacy Policy</Link>. Weather icons by{" "}
      <Link href="https://www.amcharts.com/free-animated-svg-weather-icons/">
        amCharts.com
      </Link>{" "}
      (no changes made).
    </Text>
  );
};

export default Footer;
