import Head from "next/head";
import { FC } from "react";

interface Props {}

const FiveDays: FC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>TeaWeather - Five Day Forecast</title>
        <meta name="description" content="Homepage of TeaWeather" />
      </Head>
    </>
  );
};

export default FiveDays;
