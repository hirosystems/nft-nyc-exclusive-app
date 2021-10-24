import "../styles/globals.css";
// import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from 'jotai';
import theme from "./theme";

function MyApp({ Component, pageProps }) {
  return (
    // <ChakraProvider theme={theme}>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    // </ChakraProvider>
  );
}
export default MyApp;
