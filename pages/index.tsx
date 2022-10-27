import {
  Grid,
  GridItem,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import Footer from "../components/Footer";
import WeatherDetails from "../components/home/WeatherDetails";
import WeatherIcon from "../components/home/WeatherIcon";
import { WeatherData } from "../components/interfaces";
import Navbar from "../components/Navbar";

const Home = () => {
  const data: WeatherData = {
    location: "London, UK",
    time: "Wednesday, 14:00",
    description: "Mostly sunny",
    temperature: 20,
    temperatureUnit: "°C",
    humidity: 50,
    humidityUnit: "%",
    pressure: 1000,
    pressureUnit: "hPa",
    wind: 10,
    windUnit: "km/h",
    windDirection: "N",
    precipitationProbabilityInPercent: 10,
  };
  return (
    <>
      <Head>
        <title>TeaWeather - Home</title>
        <meta name="description" content="Homepage of TeaWeather" />
      </Head>

      <Grid
        minH="100vh"
        minW="100vw"
        bg={useColorModeValue("gray.100", "gray.900")}
        templateAreas={`
          "navbar"
          "main"
          "footer"
        `}
        gridTemplateRows={"50px 1fr 30px"}
        p={`0 20px 0`}
      >
        <GridItem area="navbar">
          <Navbar activePage="home" />
        </GridItem>

        <GridItem area="main" as="main">
          <VStack
            justifyContent={"center"}
            gap="var(--chakra-space-16) !important"
          >
            <Heading as="h1" size="4xl" noOfLines={1}>
              TeaWeather
            </Heading>
            <Heading as="h2" size="lg" noOfLines={1}>
              Find the perfect weather for your afternoon tea.
            </Heading>
            <HStack gap="20px" alignItems={"flex-start"}>
              <WeatherIcon weather={data.description} />
              <WeatherDetails {...data} />
              <VStack alignItems={"flex-end"}>
                <Text as="h3" fontSize={"2xl"}>
                  {data.location}
                </Text>
                <Text>{data.time}</Text>
                <Text fontSize={"lg"}>{data.description}</Text>
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

export default Home;
