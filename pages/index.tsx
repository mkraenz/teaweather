import { Button, Input, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
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
  const [loc, setLoc] = useState({
    lat: 0,
    lon: 0,
  });
  const handleLocationApplied = async () => {
    const res = await fetch(`/api/weather-current?city=${location}`);
    if (!res.ok) {
      // TODO handle error
    }
    const data: ApiData<typeof weatherCurrentApi> = await res.json();
    setWeather(data.weather);
  };

  // TODO not the best code but works for now
  useEffect(() => {
    // based on https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API/Using_the_Geolocation_API
    const onPositionRevealed: PositionCallback = async (pos) => {
      console.log("pos", pos);
      const position = { lat: pos.coords.latitude, lon: pos.coords.longitude };
      setLoc(position);

      const res = await fetch(
        `/api/weather-current?lat=${position.lat}&lon=${position.lon}`
      );
      if (!res.ok) {
        // TODO handle error
      }
      const data: ApiData<typeof weatherCurrentApi> = await res.json();
      setWeather(data.weather);
    };

    const onPositionDenied: PositionErrorCallback = (err) => {
      console.error("permission denied", err);
    };

    const getPosition = () => {
      navigator.geolocation.getCurrentPosition(
        onPositionRevealed,
        onPositionDenied,
        {
          maximumAge: 7200 * 1000, // 2 hours in millis
        }
      );
    };

    async function handlePermission() {
      const result = await navigator.permissions.query({ name: "geolocation" });
      console.log(result.state);
      if (result.state === "granted") {
        getPosition();
      } else if (result.state === "prompt") {
        getPosition();
      } else if (result.state === "denied") {
        // do nothing. Consider showing message: "you have declined location permissions, so we can't automatically show the weather for your location"
      }
      result.onchange = function () {
        console.log("geolocation permission changed.", result.state);
      };
    }

    handlePermission();
  }, []);

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
