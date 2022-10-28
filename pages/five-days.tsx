import { VStack } from "@chakra-ui/react";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { ApiData } from "../src/api/types";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { WeatherData } from "../src/components/interfaces";
import weatherFiveDays from "./api/weather-five-days";

interface Props {
  weathers: WeatherData[];
}

// TODO fix horizontal scrollbar
const FiveDays: NextPage<Props> = ({ weathers }) => {
  return (
    <>
      <Head>
        <title>TeaWeather - Five Day Forecast</title>
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
        <Heading2 text="Three Hour Forecast" />
        <VStack gap="var(--chakra-space-4) !important">
          {weathers.map((w, i) => (
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
  const res = await fetch(`${baseUrl}/api/weather-five-days`);
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
