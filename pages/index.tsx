import { getServerSidePropsWrapper } from "@auth0/nextjs-auth0";
import { useToast, VStack } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Env } from "../src/api/env";
import { maybeGetUser } from "../src/api/get-user";
import type { ApiData, ApiData2 } from "../src/api/types";
import AddressSearchInfo from "../src/components/common/address/AddressSearchInfo";
import SearchByAddress from "../src/components/common/address/SearchByAddress";
import Heading1 from "../src/components/common/Heading1";
import Heading2 from "../src/components/common/Heading2";
import { colorWorkaroundGetServerSideProps } from "../src/components/common/layout/dark-mode-workaround";
import useGeolocationBasedWeather from "../src/components/common/use-geolocation-based-weather.hook";
import WeatherBlock from "../src/components/common/weather/WeatherBlock";
import { getLocationUrl } from "../src/components/get-location-url";
import type { WeatherData } from "../src/components/interfaces";
import type { AddressHandlerType } from "./api/address/[[...params]]";
import type weatherCurrentApi from "./api/weather-current";
import type { MyGetServerSideProps } from "./_app";

type AddressLookupResponse = ApiData2<AddressHandlerType["find"]>;
type Address = AddressLookupResponse["candidates"][number];

interface Props {
  weather: WeatherData;
}

const Home: NextPage<Props> = (props) => {
  const [weather, setWeather] = useState(props.weather);
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

  const { data, loading, error } = useGeolocationBasedWeather<
    ApiData<typeof weatherCurrentApi>
  >((lat, lon) => `/api/weather-current?lat=${lat}&lon=${lon}`);
  useEffect(() => {
    if (data) setWeather(data?.weather);
  }, [data]);

  const refetchWeather = async (lat: number, lon: number) => {
    const weatherRes = await fetch(
      `/api/weather-current?lat=${lat}&lon=${lon}`
    );
    if (!weatherRes.ok) {
      notifyUserOfError();
      return;
    }
    const weatherData: ApiData<typeof weatherCurrentApi> =
      await weatherRes.json();
    setWeather(weatherData.weather);
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
