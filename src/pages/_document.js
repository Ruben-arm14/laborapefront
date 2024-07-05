import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/imagenes/logolaborape.png" type="image/png" />
          <title>LaboraPE</title>
          <meta name="description" content="Bienvenido a LaboraPE" />
          {/* Aquí puedes agregar más meta tags si es necesario */}
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
