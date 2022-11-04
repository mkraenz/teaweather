import { getServerSidePropsWrapper } from "@auth0/nextjs-auth0";
import { Text, VStack } from "@chakra-ui/react";
import Head from "next/head";
import { maybeGetUser } from "../src/api/get-user";
import Heading1 from "../src/components/common/Heading1";
import type { MyGetServerSideProps } from "./_app";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>TeaWeather - Privacy Policy</title>
        <meta name="description" content="Privacy Policy of TeaWeather" />
      </Head>

      <VStack
        justifyContent={"center"}
        gap="var(--chakra-space-16) !important"
        pt={16}
      >
        <Heading1 text="Privacy Policy" />
        <VStack alignItems={"flex-start"}>
          <Text textAlign={"left"}>
            Your privacy is important to us. It is TeaWeather&apos;s policy to
            respect your privacy regarding any information we may collect from
            you across our website, https://teaweather.vercel.app, and other
            sites we own and operate.
          </Text>
          <Text>
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent. We also let you know why we are
            collecting it and how it will be used.
          </Text>
          <Text>
            We only retain collected information for as long as necessary to
            provide the service you have requested, or as long as applicable law
            requires us.
          </Text>
          <Text>More blablablabla</Text>
        </VStack>
      </VStack>
    </>
  );
};

const _getServerSideProps: MyGetServerSideProps = async (context) => {
  const cookie = context.req?.headers.cookie ?? "";
  const user = maybeGetUser(context.req, context.res);
  return {
    props: {
      cookies: cookie,
      user,
    },
  };
};
export const getServerSideProps =
  getServerSidePropsWrapper(_getServerSideProps);

export default PrivacyPolicy;
