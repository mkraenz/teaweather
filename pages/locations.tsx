import { getServerSidePropsWrapper, useUser } from "@auth0/nextjs-auth0";
import {
  Skeleton,
  Stack,
  Text,
  useBreakpointValue,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { Env } from "../src/api/env";
import { maybeGetUser } from "../src/api/get-user";
import type { ApiData, ApiData2 } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SignInButton from "../src/components/common/layout/SignInButton";
import SignUpButton from "../src/components/common/layout/SignUpButton";
import SearchByCity from "../src/components/common/SearchByCity";
import LocationBlock from "../src/components/locations/LocationBlock";
import {
  LocationsStateProvider,
  useLocations,
  WeatherLocation,
} from "../src/components/locations/locations-state";
import MobileLocationBlock from "../src/components/locations/MobileLocationBlock";
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
  locations: WeatherLocation[];
}

const Locations: FC = () => {
  const { dispatch, allLocations } = useLocations();
  const [locationSearch, setLocationSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  // TODO SSR
  const isOnMobile = useBreakpointValue(
    { base: true, md: false },
    { fallback: "md" }
  );

  const locations = allLocations;
  useEffect(() => {
    // intentionally unawaited
    locations.forEach(async (loc) => {
      dispatch({ type: "fetch-weather", id: loc.location.id });
      const res = await fetch(
        `/api/weather-current?lat=${loc.location.lat}&lon=${loc.location.lon}`
      );
      if (!res.ok) {
        dispatch({
          type: "fetch-weather-failed",
          id: loc.location.id,
          error: res.statusText,
        });
        return;
      }
      const weatherRes: ApiData<typeof weatherCurrent> = await res.json();
      dispatch({
        type: "set-weather",
        id: loc.location.id,
        weather: weatherRes.weather,
      });
    });
  }, []); // only run once. when adding locations, the weather is delivered with the new location

  const addLocation = async () => {
    if (!locationSearch) return;
    setLoading(true);
    const city = locationSearch.split(",")[0].trim();
    const countryCode = (
      locationSearch.split(",")[1]?.trim() || "DE"
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
    dispatch({ type: "add", location: { ...data } });
    setLoading(false);
  };

  if (!user) return <UnauthenticatedLocations />;
  if (isOnMobile)
    return (
      <MobileLocations
        loading={loading}
        locations={locations}
        setLocationSearch={setLocationSearch}
        addLocation={addLocation}
      />
    );

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
          {(locations || []).map(({ location, weather }, i) => (
            <WrapItem key={i}>
              <LocationBlock weather={weather} location={location} />
            </WrapItem>
          ))}
          {loading && (
            <Skeleton
              height={135}
              rounded="xl"
              width={{ base: "full", md: 500 }}
            />
          )}
        </Wrap>
      </VStack>
    </>
  );
};

const MobileLocations: FC<{
  locations: WeatherLocation[];
  setLocationSearch: (value: string) => void;
  addLocation: () => void;
  loading: boolean;
}> = ({ locations, setLocationSearch, addLocation, loading }) => {
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
          {(locations || []).map(({ location, weather }, i) => (
            <WrapItem key={i}>
              <MobileLocationBlock weather={weather} location={location} />
            </WrapItem>
          ))}
          {loading && (
            <Skeleton
              height={135}
              rounded="xl"
              width={{ base: "full", md: 500 }}
            />
          )}
        </Wrap>
      </VStack>
    </>
  );
};

const LocationsPage: NextPage<Props> = ({ locations }) => {
  return (
    <LocationsStateProvider initialLocations={locations}>
      <Locations />
    </LocationsStateProvider>
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
      loading: false,
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

export default LocationsPage;
