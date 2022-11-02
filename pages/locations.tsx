import { Button, VStack } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { ApiData } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SearchByCity from "../src/components/common/SearchByCity";
import { GetAllLocationsResponse200Data } from "./api/locations/get-all";
import weatherCurrent from "./api/weather-current";

type Point = { lat: number; lon: number };
type City = { city: string; country: string } & Point;
type Location = City | Point;

interface Props {
  locations: { location: Location }[];
}

const Locations: NextPage<Props> = (props) => {
  const [locations, setLocations] = useState(props.locations);
  const [locationSearch, setLocationSearch] = useState("");
  const searchByLocation = async () => {
    if (!locationSearch) return;
    const city = encodeURIComponent(locationSearch.split(",")[0]);
    const country = encodeURIComponent(locationSearch.split(", ")[1] || "de");
    const res = await fetch(
      `/api/location/create?city=${city}&countryCode=${country}`
    );
    if (!res.ok) {
      // TODO handle error
    }
    // TODO
    const data: ApiData<typeof weatherCurrent> = await res.json();
    // setLocations([...locations, { weather: data.weather, location: data.location });
  };

  const triggerAWSRequest = async () => {
    const res = await fetch("/api/locations/add", {
      method: "POST",
      body: JSON.stringify({ city: "Berlin", country: "DE" }),
    });
    console.log(res.status);
    const data = await res.json();
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>TeaWeather - My Locations</title>
        <meta
          name="description"
          content="Weather forecast for my favorite locations"
        />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading2 as="h1" text={`my locations`} textTransform="capitalize" />

        <Button onClick={triggerAWSRequest}>Trigger AWS API Request</Button>
        <SearchByCity onInput={setLocationSearch} onSearch={searchByLocation} />
        {/* <VStack gap="var(--chakra-space-4) !important">
          {(locations || props.locations).map((w, i) => (
            <WeatherBlock key={w.time} weather={w} withLocation={i === 0} />
          ))}
        </VStack> */}
        <pre>{JSON.stringify(locations, null, 2)}</pre>
      </VStack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  {
    cookies: string;
  } & Props
> = async (context) => {
  const baseUrl = process.env.BASE_URL ?? "";
  const cookies = context.req?.headers.cookie ?? "";
  let locations: Props["locations"] = [];

  const res = await fetch(`${baseUrl}/api/locations/get-all`, {
    // need to pass cookies to get past Auth0's withApiAuthRequired in the api route
    headers: { cookie: context.req.headers.cookie! },
  });

  if (res.ok) {
    const json: GetAllLocationsResponse200Data = await res.json();
    locations = json.locations.map((location) => ({ location }));
  }
  const workaround = await colorWorkaroundGetServerSideProps(context);

  return {
    props: {
      cookies: workaround.props.cookies,
      locations,
    },
  };
};

export default Locations;
