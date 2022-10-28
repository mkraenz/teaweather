import { Button, Input, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { ApiData } from "../src/api/types";
import Heading1 from "../src/components/common/Heading1";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { WeatherData } from "../src/components/interfaces";
import type weatherCurrentApi from "./api/weather-current";

interface Props {
  weather: WeatherData;
}

const Home: NextPage<Props> = (props) => {
  const [weather, setWeather] = useState(props.weather);
  const [location, setLocation] = useState("");
  const handleLocationApplied = async () => {
    const res = await fetch(`/api/weather-current?city=${location}`);
    if (!res.ok) {
      // TODO handle error
    }
    const data: ApiData<typeof weatherCurrentApi> = await res.json();
    setWeather(data.weather);
  };

  return (
    <>
      <Head>
        <title>TeaWeather - Home</title>
        <meta name="description" content="Homepage of TeaWeather" />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading1 text="TeaWeather" />
        <Heading2 text="Find the perfect weather for your afternoon tea." />
        <WeatherBlock weather={weather} withLocation />
        <Input
          placeholder="Your city"
          size="md"
          type="search"
          maxW={300}
          onChange={(e) => setLocation(e.currentTarget.value)}
        />
        <Button onClick={handleLocationApplied}>Apply</Button>
      </VStack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  {
    cookies: string;
  } & Props
> = async (context) => {
  const baseUrl = process.env.BASE_URL ?? ""; // when this is executed on server, env var is defined. But when executed on client, env var is undefined. With fallback, we ensure a relative api call from the client
  const res = await fetch(`${baseUrl}/api/weather-current?city=Berlin`);
  const json: ApiData<typeof weatherCurrentApi> = await res.json();

  const workaround = await colorWorkaroundGetServerSideProps(context);

  return {
    props: {
      cookies: workaround.props.cookies,
      weather: json.weather,
    },
  };
};

export default Home;
