import { getServerSidePropsWrapper } from "@auth0/nextjs-auth0";
import { useToast, VStack } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Env } from "../src/api/env";
import { maybeGetUser } from "../src/api/get-user";
import type { ApiData, ApiData2 } from "../src/api/types";
import type { Address } from "../src/components/common/address/Address";
import AddressSearchInfo from "../src/components/common/address/AddressSearchInfo";
import SearchByAddress from "../src/components/common/address/SearchByAddress";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import useGeolocationBasedWeather from "../src/components/common/use-geolocation-based-weather.hook";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { getLocationUrl } from "../src/components/get-location-url";
import type { WeatherData } from "../src/components/interfaces";
import type { AddressHandlerType } from "./api/address/[[...params]]";
import type {
  default as weatherFiveDays,
  default as weatherFiveDaysApi,
} from "./api/weather-five-days";
import type { MyGetServerSideProps } from "./_app";

type AddressLookupResponse = ApiData2<AddressHandlerType["find"]>;

interface Props {
  weathers: WeatherData[];
}

const FiveDays: NextPage<Props> = (props) => {
  const [weathers, setWeathers] = useState(props.weathers);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, selectAddress] = useState<Address | null>(null);
  const [addressSearch, setAddressSearch] = useState("");
  const toast = useToast();

  const notifyUserOfError = () =>
    toast({
      title: "Something went wrong. Please try again later.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  const refetchWeather = async (lat: number, lon: number) => {
    const weatherRes = await fetch(
      `/api/weather-five-days?lat=${lat}&lon=${lon}`
    );
    if (!weatherRes.ok) {
      notifyUserOfError();
      return;
    }
    const weatherData: ApiData<typeof weatherFiveDaysApi> =
      await weatherRes.json();
    setWeathers(weatherData.weathers);
  };
  const searchByAddress = async () => {
    if (!addressSearch) return;
    const res = await fetch(`/api/address?address=${addressSearch}`);
    if (!res.ok) {
      notifyUserOfError();
      return;
    }
    const data: AddressLookupResponse = await res.json();
    setAddresses(data.candidates);

    if (isEmpty(data.candidates)) return;
    const firstAddress = data.candidates[0];
    selectAddress(firstAddress);
    const location = firstAddress.location;
    await refetchWeather(location.y, location.x);
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
          as="h1"
          text={`five days forecast for ${
            weathers ? weathers[0]?.location : props.weathers[0].location
          }`}
          textTransform="capitalize"
        />
        <SearchByAddress
          onInput={setAddressSearch}
          onSearch={searchByAddress}
        />
        {selectedAddress && (
          <AddressSearchInfo
            addresses={addresses}
            selectedAddress={selectedAddress}
            onChangeAddress={async (address) => {
              selectAddress(address);
              const location = address.location;
              await refetchWeather(location.y, location.x);
            }}
          />
        )}
        <VStack gap="var(--chakra-space-4) !important">
          {(weathers || props.weathers).map((w, i) => (
            <WeatherBlock key={w.time} weather={w} withLocation={i === 0} />
          ))}
        </VStack>
      </VStack>
    </>
  );
};

const _getServerSideProps: MyGetServerSideProps<Props> = async (context) => {
  const baseUrl = Env.baseUrl ?? "";
  const cookies = context.req?.headers.cookie ?? "";
  const user = maybeGetUser(context.req, context.res);

  const url = getLocationUrl(cookies, baseUrl, "/weather-five-days");
  const res = await fetch(url.toString());
  const json: ApiData<typeof weatherFiveDays> = await res.json();

  const workaround = await colorWorkaroundGetServerSideProps(context);

  return {
    props: {
      cookies: workaround.props.cookies,
      weathers: json.weathers,
      user,
    },
  };
};
export const getServerSideProps =
  getServerSidePropsWrapper(_getServerSideProps);

export default FiveDays;
