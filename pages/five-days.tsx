import { VStack } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ApiData } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import SearchByCity from "../src/components/common/SearchByCity";
import useGeolocationBasedWeather from "../src/components/common/use-geolocation-based-weather.hook";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { getLocationUrl } from "../src/components/get-location-url";
import { WeatherData } from "../src/components/interfaces";
import weatherFiveDays from "./api/weather-five-days";

interface Props {
  weathers: WeatherData[];
}

const FiveDays: NextPage<Props> = (props) => {
  const [weathers, setWeathers] = useState(props.weathers);
  const [locationSearch, setLocationSearch] = useState("");
  const searchByLocation = async () => {
    if (!locationSearch) return;
    const city = encodeURIComponent(locationSearch.split(",")[0]);
    const country = encodeURIComponent(locationSearch.split(", ")[1] || "de");
    const res = await fetch(
      `/api/weather-five-days?city=${city}&countryCode=${country}`
    );
    if (!res.ok) {
      // TODO handle error
    }
    const data: ApiData<typeof weatherFiveDays> = await res.json();
    setWeathers(data.weathers);
  };

  const { data, loading, error } = useGeolocationBasedWeather<
    ApiData<typeof weatherFiveDays>
  >((lat, lon) => `/api/weather-five-days?lat=${lat}&lon=${lon}`);
  useEffect(() => {
    if (data) setWeathers(data?.weathers);
  }, [data]);

  return (
    <>
      <Head>
        <title>TeaWeather - Five Days Forecast</title>
        <meta
          name="description"
          content="Weather forecast for the next five days in steps of three hours on TeaWeather"
        />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading2
          text={`five days forecast for ${
            weathers ? weathers[0]?.location : props.weathers[0].location
          }`}
          textTransform="capitalize"
        />
        <SearchByCity onInput={setLocationSearch} onSearch={searchByLocation} />
        <VStack gap="var(--chakra-space-4) !important">
          {(weathers || props.weathers).map((w, i) => (
            <WeatherBlock key={w.time} weather={w} withLocation={i === 0} />
          ))}
        </VStack>
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

  const url = getLocationUrl(cookies, baseUrl, "/weather-five-days");
  const res = await fetch(url.toString());
  const json: ApiData<typeof weatherFiveDays> = await res.json();

  const workaround = await colorWorkaroundGetServerSideProps(context);

  return {
    props: {
      cookies: workaround.props.cookies,
      weathers: json.weathers,
    },
  };
};

export default FiveDays;
