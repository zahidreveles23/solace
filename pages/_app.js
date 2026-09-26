import "../styles/globals.css";
import Head from "next/head";
import Nav from "../components/Nav";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Solace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Mental health support powered by AI. Your refuge for healing."
        />
      </Head>
      <Nav />
      <Component {...pageProps} />
    </>
  );
}
