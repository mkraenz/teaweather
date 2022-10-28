import { SearchIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
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
  const searchInputTextColor = useColorModeValue("gray.600", "gray.300");
  const searchButtonColor = useColorModeValue("cyan.300", "blue.700");
  const searchButtonHoverColor = useColorModeValue("cyan.200", "blue.800");
  const [weather, setWeather] = useState(props.weather);
  const [locationSearch, setLocationSearch] = useState("");
  const handleLocationApplied = async () => {
    const city = locationSearch.split(",")[0];
    const country = locationSearch.split(", ")[1] || "de";
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
        <FormControl
          maxW={{
            base: "full",
            md: 360,
          }}
          px={4}
        >
          <FormLabel
            htmlFor="search"
            fontWeight={"normal"}
            color={searchInputTextColor}
          >
            Search by City and Country
          </FormLabel>
          <InputGroup size="md">
            <Input
              placeholder="Example: Tokyo, jp"
              variant="filled"
              // size="md"
              bg="whiteAlpha.200"
              color={searchInputTextColor}
              pr="4.5rem"
              type={"search"}
              onChange={(e) => setLocationSearch(e.currentTarget.value)}
            />
            <InputRightElement>
              <IconButton
                size="md"
                aria-label="Search"
                onClick={handleLocationApplied}
                icon={<SearchIcon />}
                color={searchInputTextColor}
                _hover={{
                  bg: searchButtonHoverColor,
                }}
                bg={searchButtonColor}
              ></IconButton>
            </InputRightElement>
          </InputGroup>
        </FormControl>
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
  const locationCookieValue = cookies
    .split("teaweather-location=")[1]
    ?.split(";")[0];
  // TODO own extract to function.
  // TODO SECURITY HIGH PRIORITY: validate and handle errors (e.g. invalid cookie value - currently this might be used for an injection attack!)
  const url = locationCookieValue
    ? `${baseUrl}/api/weather-current?lat=${
        JSON.parse(locationCookieValue).lat
      }&lon=${JSON.parse(locationCookieValue).lon}`
    : `${baseUrl}/api/weather-current?city=Berlin&countryCode=de`;
  const res = await fetch(url);
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
