// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  styles: {
    global: {
      "html, body": {
        color: "yellow",
        bgColor: "black"
      },
      a: {
        color: "teal.500",
      },
    },
  },
};
// 3. extend the theme
const theme = extendTheme({ config });
export default theme;
