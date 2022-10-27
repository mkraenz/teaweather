import { Grid, GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { ApiData } from "../src/api/types";
import Heading1 from "../src/components/common/Heading1";
import Heading2 from "../src/components/common/Heading2";
import Footer from "../src/components/Footer";
import WeatherDetails from "../src/components/home/WeatherDetails";
import WeatherIcon from "../src/components/home/WeatherIcon";
import { WeatherData } from "../src/components/interfaces";
import Navbar from "../src/components/Navbar";
import type weatherCurrentApi from "./api/weather-current";

interface Props {
  weather: WeatherData;
}

const Home: NextPage<Props> = ({ weather }) => {
  return (
    <>
      <Head>
        <title>TeaWeather - Home</title>
        <meta name="description" content="Homepage of TeaWeather" />
      </Head>

      <Grid
        minH="100vh"
        minW="100vw"
        // TODO dark mode
        bg={"linear-gradient(0deg, white 0%, #99eeff 100%);"}
        templateAreas={`
          "navbar"
          "main"
          "footer"
        `}
        gridTemplateRows={"70px 1fr 30px"}
      >
        <GridItem area="navbar" as="nav">
          <Navbar />
        </GridItem>

        <GridItem area="main" as="main">
          <VStack
            justifyContent={"center"}
            gap="var(--chakra-space-16) !important"
            pt={16}
          >
            <Heading1 text="TeaWeather" />
            <Heading2 text="Find the perfect weather for your afternoon tea." />
            <HStack gap="20px" alignItems={"flex-start"}>
              <WeatherIcon weather={weather.description} />
              <WeatherDetails {...weather} />
              <VStack alignItems={"flex-end"}>
                <Text as="h3" fontSize={"2xl"}>
                  {weather.location}
                </Text>
                <Text>{weather.time}</Text>
                <Text fontSize={"lg"}>{weather.description}</Text>
              </VStack>
            </HStack>
          </VStack>
        </GridItem>

        <GridItem area="footer" as="footer">
          <Footer />
        </GridItem>
      </Grid>
    </>
  );
};

Home.getInitialProps = async (ctx) => {
  console.log("headers", ctx.req?.headers);
  const res = await fetch(`${process.env.BASE_URL}/api/weather-current`);
  const json: ApiData<typeof weatherCurrentApi> = await res.json();
  return { weather: json.weather };
};

export default Home;
