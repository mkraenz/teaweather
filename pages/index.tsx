import { VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ApiData } from "../src/api/types";
import Heading1 from "../src/components/common/Heading1";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SearchByCity from "../src/components/common/SearchByCity";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { getLocationUrl } from "../src/components/get-location-url";
import { WeatherData } from "../src/components/interfaces";
import type weatherCurrentApi from "./api/weather-current";

interface Props {
  weather: WeatherData;
}

const Home: NextPage<Props> = (props) => {
  const [weather, setWeather] = useState(props.weather);
  const [locationSearch, setLocationSearch] = useState("");
  const handleLocationApplied = async () => {
    if (!locationSearch) return;
    const city = encodeURIComponent(locationSearch.split(",")[0]);
    const country = encodeURIComponent(locationSearch.split(", ")[1] || "de");
    const res = await fetch(
      `/api/weather-current?city=${city}&countryCode=${country}`
    );
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
      document.cookie = `teaweather-location=${JSON.stringify(
        position
      )}; max-age=7200`; // 7200 seconds = 2 hours
    };
    const fetchWeather = async (position: { lat: number; lon: number }) => {
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

    async function getGeolocation() {
      if (document.cookie.includes("teaweather-location")) {
        const locationCookieValue = document.cookie
          .split("teaweather-location=")[1]
          .split(";")[0];
        console.log("location cookie found:", locationCookieValue);
        const position = JSON.parse(locationCookieValue);
        return fetchWeather(position);
      }

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

    getGeolocation();
  }, []);

  return (
    <>
      <Head>
        <title>TeaWeather - Home</title>
        <meta
          name="description"
          content="Find the perfect weather for your afternoon tea."
        />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading1 text="TeaWeather" />
        <Heading2 text="Find the perfect weather for your afternoon tea." />
        <WeatherBlock weather={weather} withLocation />
        <SearchByCity
          onInput={setLocationSearch}
          onSearch={handleLocationApplied}
        />
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
  const cookies = context.req?.headers.cookie ?? "";

  const url = getLocationUrl(cookies, baseUrl, "/weather-current");
  const res = await fetch(url.toString());
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
