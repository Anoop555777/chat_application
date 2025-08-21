import { Box, useColorModeValue } from "@chakra-ui/react";

const FullPage = ({ children }) => {
  return (
    <Box
      minH="100vh"
      width="full"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      {children}
    </Box>
  );
};

export default FullPage;
