import { VStack } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";
import { ApiData } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { WeatherData } from "../src/components/interfaces";
import type weatherCurrentApi from "./api/weather-current";

interface Props {
  weather: WeatherData;
}

const FiveDays: NextPage<Props> = ({ weather }) => {
  return (
    <>
      <Head>
        <title>TeaWeather - Five Day Forecast</title>
        <meta
          name="description"
          content="Weather forecast in steps of five days on TeaWeather"
        />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading2 text="Five Days" />
        <VStack gap="var(--chakra-space-4) !important">
          <WeatherBlock weather={weather} withLocation />
          <WeatherBlock weather={weather} />
          <WeatherBlock weather={weather} />
          <WeatherBlock weather={weather} />
          <WeatherBlock weather={weather} />
        </VStack>
      </VStack>
    </>
  );
};

FiveDays.getInitialProps = async (ctx) => {
  const baseUrl = process.env.BASE_URL ?? ""; // when this is executed on server, env var is defined. But when executed on client, env var is undefined. With fallback, we ensure a relative api call from the client
  const res = await fetch(`${baseUrl}/api/weather-current`);
  const json: ApiData<typeof weatherCurrentApi> = await res.json();
  return { weather: json.weather };
};

export default FiveDays;
