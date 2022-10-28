import { VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { ApiData } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { WeatherData } from "../src/components/interfaces";
import weatherThreeHours from "./api/weather-three-hours";

interface Props {
  weathers: WeatherData[];
}

const ThreeHours: NextPage<Props> = ({ weathers }) => {
  return (
    <>
      <Head>
        <title>TeaWeather - Three Hour Forecast</title>
        <meta
          name="description"
          content="Weather forecast in steps of three hours on TeaWeather"
        />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading2 text="Three Hour Forecast" />
        <VStack gap="var(--chakra-space-4) !important">
          {weathers.map((w, i) => (
            <WeatherBlock key={w.time} weather={w} withLocation={i === 0} />
          ))}
        </VStack>
      </VStack>
    </>
  );
};

ThreeHours.getInitialProps = async (ctx) => {
  const baseUrl = process.env.BASE_URL ?? ""; // when this is executed on server, env var is defined. But when executed on client, env var is undefined. With fallback, we ensure a relative api call from the client
  const res = await fetch(`${baseUrl}/api/weather-three-hours`);
  const json: ApiData<typeof weatherThreeHours> = await res.json();
  return { weathers: json.weathers };
};

export default ThreeHours;
