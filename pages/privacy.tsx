import { Grid } from "@chakra-ui/react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>TeaWeather - Privacy Policy</title>
        <meta name="description" content="Privacy Policy of TeaWeather" />
      </Head>

      <Grid templateAreas={""}>
        <main className={styles.main}></main>

        <footer className={styles.footer}></footer>
      </Grid>
    </>
  );
};

export default PrivacyPolicy;
