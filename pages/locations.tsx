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
import { useEffect, useState } from "react";
import type { ILocation } from "../src/api/domain/Location";
import { Env } from "../src/api/env";
import { maybeGetUser } from "../src/api/get-user";
import type { ApiData, ApiData2 } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SignInButton from "../src/components/common/layout/SignInButton";
import SignUpButton from "../src/components/common/layout/SignUpButton";
import SearchByCity from "../src/components/common/SearchByCity";
import LocationBlock from "../src/components/common/weather/LocationBlock";
import type { WeatherData } from "../src/components/interfaces";
import type { LocationsHandlerType } from "./api/locations/[[...params]]";
import type weatherCurrent from "./api/weather-current";
import type { MyGetServerSideProps } from "./_app";

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
  locations: { location: ILocation; weather: WeatherData }[];
}

const Locations: NextPage<Props> = (props) => {
  const [locations, setLocations] = useState(props.locations);
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(
    () => {
      // intentionally unawaited
      locations.forEach(async (loc) => {
        const res = await fetch(
          `/api/weather-current?lat=${loc.location.lat}&lon=${loc.location.lon}`
        );
        const weatherRes: ApiData<typeof weatherCurrent> = await res.json();
        // wow this code is terrible. I wish i'd be using some state management library
        setLocations((prev) => {
          const newLocations = [...prev];
          const l = newLocations.find((x) => x.location.id === loc.location.id);
          if (l) l.weather = weatherRes.weather;
          return newLocations;
        });
      });
    },
    locations.map((l) => l.location.id)
  );

  const addLocation = async () => {
    if (!locationSearch) return;
    setLoading(true);
    const city = locationSearch.split(",")[0].trim();
    const countryCode = (
      locationSearch.split(",")[1].trim() || "DE"
    ).toUpperCase();
    const type = "city";
    const res = await fetch("/api/locations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ city, countryCode, type }),
    });
    if (!res.ok) {
      if (res.status === 422) alert("You can only track up to 30 locations.");

      // TODO handle error
      console.error("Error while adding location", res.status, {
        city,
        countryCode,
      });
      setLoading(false);
      return;
    }
    const data: ApiData2<LocationsHandlerType["add"]> = await res.json();
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
              <LocationBlock weather={weather} location={location} />
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

  const res = await fetch(`${baseUrl}/api/locations`, {
    // need to pass cookies to get past Auth0's withApiAuthRequired in the api route
    headers: { cookie },
  });

  if (res.ok) {
    const json: ApiData2<LocationsHandlerType["find"]> = await res.json();
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
