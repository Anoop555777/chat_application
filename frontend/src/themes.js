import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      "*": {
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      },
      "html, body, #root": {
        height: "100%",
        width: "100%",
        background: "transparent",
        fontSize: "18px",
      },
      body: {
        fontFamily: "Nunito",
        lineHeight: "normal",
        fontWeight: 400,
        backgroundColor: "transparent",
      },
    },
  },
  components: {
    // Reset Chakra default paddings/margins for Box, Text, etc.
    Container: {
      baseStyle: {
        maxW: "100%",
        p: 0,
      },
    },
    Heading: {
      baseStyle: {
        margin: 0,
        padding: 0,
        fontWeight: "normal",
      },
    },
    Text: {
      baseStyle: {
        margin: 0,
        padding: 0,
      },
    },
  },
  config: {
    cssVarPrefix: "", // Remove the "chakra" prefix for CSS variables
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;
