import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head />
        <link rel="icon" type="image/png" href="hiro-favicon.png"></link>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
