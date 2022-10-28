import { Text } from "@chakra-ui/react";
import Head from "next/head";
import { FC } from "react";

interface Props {}

const ThreeHours: FC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>TeaWeather - Three Hour Forecast</title>
        <meta
          name="description"
          content="Weather forecast in steps of three hours on TeaWeather"
        />
      </Head>

      <Text>Three hour forecast</Text>
    </>
  );
};

export default ThreeHours;
