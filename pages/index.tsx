import { getServerSidePropsWrapper } from "@auth0/nextjs-auth0";
import { VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { maybeGetUser } from "../src/api/get-user";
import type { ApiData } from "../src/api/types";
import Heading1 from "../src/components/common/Heading1";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SearchByCity from "../src/components/common/SearchByCity";
import useGeolocationBasedWeather from "../src/components/common/use-geolocation-based-weather.hook";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { getLocationUrl } from "../src/components/get-location-url";
import type { WeatherData } from "../src/components/interfaces";
import { Env } from "./api/env";
import type weatherCurrentApi from "./api/weather-current";
import type { MyGetServerSideProps } from "./_app";

interface Props {
  weather: WeatherData;
}

const Home: NextPage<Props> = (props) => {
  const [weather, setWeather] = useState(props.weather);
  const [locationSearch, setLocationSearch] = useState("");
  const searchByLocation = async () => {
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

  const { data, loading, error } = useGeolocationBasedWeather<
    ApiData<typeof weatherCurrentApi>
  >((lat, lon) => `/api/weather-current?lat=${lat}&lon=${lon}`);
  useEffect(() => {
    if (data) setWeather(data?.weather);
  }, [data]);

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
        <SearchByCity onInput={setLocationSearch} onSearch={searchByLocation} />
      </VStack>
    </>
  );
};

const _getServerSideProps: MyGetServerSideProps<Props> = async (context) => {
  const baseUrl = Env.baseUrl ?? ""; // when this is executed on server, env var is defined. But when executed on client, env var is undefined. With fallback, we ensure a relative api call from the client
  const cookies = context.req?.headers.cookie ?? "";
  const user = maybeGetUser(context.req, context.res);

  const url = getLocationUrl(cookies, baseUrl, "/weather-current");
  const res = await fetch(url.toString());
  const json: ApiData<typeof weatherCurrentApi> = await res.json();

  const workaround = await colorWorkaroundGetServerSideProps(context);

  return {
    props: {
      cookies: workaround.props.cookies,
      weather: json.weather,
      user,
    },
  };
};
// Workaround: https://github.com/auth0/nextjs-auth0/issues/524 and https://github.com/auth0/nextjs-auth0/blob/main/FAQ.md#3-im-getting-the-warningerror-you-should-not-access-res-after-getserversideprops-resolves. Auth0's TS types suck so that's why I use a separate function _getServerSideProps
export const getServerSideProps =
  getServerSidePropsWrapper(_getServerSideProps);

export default Home;
