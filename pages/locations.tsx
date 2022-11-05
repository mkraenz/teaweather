import { getServerSidePropsWrapper, useUser } from "@auth0/nextjs-auth0";
import {
  Skeleton,
  Stack,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { Env } from "../src/api/env";
import { maybeGetUser } from "../src/api/get-user";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SignInButton from "../src/components/common/layout/SignInButton";
import SignUpButton from "../src/components/common/layout/SignUpButton";
import SearchByCity from "../src/components/common/SearchByCity";
import LocationBlock from "../src/components/common/weather/LocationBlock";
import type { WeatherData } from "../src/components/interfaces";
import type { AddResponseData } from "./api/locations/add";
import type { GetAllLocationsResponse200Data } from "./api/locations/get-all";
import type { MyGetServerSideProps } from "./_app";

type Point = { lat: number; lon: number };
type City = { city: string; country: string } & Point;
type Location = (City | Point) & { id: string; customName?: string };
// TODO continue here

const PageHead = () => (
  <Head>
    <title>TeaWeather - My Locations</title>
    <meta
      name="description"
      content="Weather forecast for my favorite locations"
    />
  </Head>
);

const UnauthenticatedLocations = () => (
  <>
    <PageHead />
    <VStack
      justifyContent={"center"}
      gap="var(--chakra-space-16) !important"
      pt={16}
    >
      <Heading2 as="h1" text={`my locations`} textTransform="capitalize" />
      <Text>Please sign in to track custom locations.</Text>

      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <SignInButton />
        <SignUpButton />
      </Stack>
    </VStack>
  </>
);

interface Props {
  locations: { location: Location; weather: WeatherData }[];
}

// TODO if not logged in, show login button and feature preview
const Locations: NextPage<Props> = (props) => {
  const [locations, setLocations] = useState(props.locations);
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const addLocation = async () => {
    if (!locationSearch) return;
    setLoading(true);
    const city = encodeURIComponent(locationSearch.split(",")[0]);
    const country = encodeURIComponent(locationSearch.split(", ")[1] || "DE");
    const res = await fetch("/api/locations/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, country }),
    });
    if (!res.ok) {
      // TODO handle error
      console.error("Error while adding location", res.status, {
        city,
        country,
      });
      setLoading(false);
      return;
    }
    const data: AddResponseData = await res.json();
    setLocations([
      // newest location first
      { weather: data.weather, location: data.location },
      ...locations,
    ]);
    setLoading(false);
  };

  if (!user) return <UnauthenticatedLocations />;

  return (
    <>
      <PageHead />
      <VStack justifyContent={"center"} gap={{ base: 8, md: 16 }} pt={16}>
        <Heading2 as="h1" text={`my locations`} textTransform="capitalize" />
        <SearchByCity
          onInput={setLocationSearch}
          onSearch={addLocation}
          label="Track a new location"
          icon="add"
        />
        <Wrap spacing={8} justify={"center"}>
          {loading && (
            <Skeleton
              height={135}
              rounded="xl"
              width={{ base: "full", md: 500 }}
            />
          )}
          {(locations || props.locations).map(({ location, weather }, i) => (
            <WrapItem key={i}>
              <LocationBlock
                weather={weather}
                withLocation
                customLocation={
                  "city" in location
                    ? `${location.city}, ${location.country}`
                    : undefined
                }
              />
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </>
  );
};

const _getServerSideProps: MyGetServerSideProps<Props> = async (context) => {
  const baseUrl = Env.baseUrl ?? "";
  const cookie = context.req?.headers.cookie ?? "";
  const user = maybeGetUser(context.req, context.res);
  let locations: Props["locations"] = [];

  const res = await fetch(`${baseUrl}/api/locations/get-all`, {
    // need to pass cookies to get past Auth0's withApiAuthRequired in the api route
    headers: { cookie },
  });

  if (res.ok) {
    const json: GetAllLocationsResponse200Data = await res.json();
    locations = json.locations.map((location) => ({
      location,
      weather: {
        description: "Loading...",
        icon: "01d",
        temp: 0,
        time: new Date().toISOString(),
        humidity: 0,
        windSpeed: 0,
        humidityUnit: "%",
        tempUnit: "°C",
        windSpeedUnit: "m/s",
        location: `(${location.lat} ${location.lon})`,
        precipitationProbabilityInPercent: 0,
        pressure: 0,
        pressureUnit: "hPa",
        temperature: 0,
        temperatureUnit: "°C",
        weatherTypeId: 800,
        wind: 0,
        windUnit: "m/s",
        windDirection: "N",
      },
    }));
  }
  const workaround = await colorWorkaroundGetServerSideProps(context);

  return {
    props: {
      cookies: workaround.props.cookies,
      locations,
      user,
    },
  };
};
export const getServerSideProps =
  getServerSidePropsWrapper(_getServerSideProps);

export default Locations;
