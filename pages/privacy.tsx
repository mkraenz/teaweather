import { Grid, GridItem, Heading, Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>TeaWeather - Privacy Policy</title>
        <meta name="description" content="Privacy Policy of TeaWeather" />
      </Head>

      <Grid
        templateAreas={`
        "navbar"
        "main"
        "footer"
      `}
        gridTemplateRows={"50px 1fr 30px"}
        p={`0 20px 0`}
        minH="100vh"
        minW="100vw"
      >
        <GridItem area="navbar">
          <Navbar activePage={"privacy"} />
        </GridItem>
        <GridItem area="main" as="main">
          <VStack
            justifyContent={"center"}
            gap="var(--chakra-space-16) !important"
          >
            <Heading size={"xl"} as="h1">
              Privacy Policy
            </Heading>
            <VStack alignItems={"flex-start"}>
              <Text textAlign={"left"}>
                Your privacy is important to us. It is TeaWeather&apos;s policy
                to respect your privacy regarding any information we may collect
                from you across our website, https://teaweather.vercel.app, and
                other sites we own and operate.
              </Text>
              <Text>
                We only ask for personal information when we truly need it to
                provide a service to you. We collect it by fair and lawful
                means, with your knowledge and consent. We also let you know why
                we are collecting it and how it will be used.
              </Text>
              <Text>
                We only retain collected information for as long as necessary to
                provide the service you have requested, or as long as applicable
                law requires us.
              </Text>
              <Text>More blablablabla</Text>
            </VStack>
          </VStack>
        </GridItem>

        <GridItem as="footer" area="footer">
          <Footer />
        </GridItem>
      </Grid>
    </>
  );
};

export default PrivacyPolicy;
