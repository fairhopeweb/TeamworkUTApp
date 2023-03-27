import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your a list of your Teamwork unassigned tasks."
          />
          <meta property="og:site_name" content="" />
          <meta
            property="og:description"
            content="Generate your a list of your Teamwork unassigned tasks."
          />
          <meta property="og:title" content="Teamwork Unassigned tasks list generator." />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Teamwork Unassigned tasks list generator." />
          <meta
            name="twitter:description"
            content="Generate your a list of your Teamwork unassigned tasks."
          />
          <meta
            property="og:image"
            content=""
          />
          <meta
            name="twitter:image"
            content=""
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;