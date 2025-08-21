// import { Spinner, Text, VStack } from "@chakra-ui/react";

// const SpinnerUI = ({ size = "xl" }) => {
//   return (
//     <VStack>
//       <Spinner
//         thickness="4px"
//         speed="0.65s"
//         emptyColor="gray.200"
//         color="teal.500"
//         size={size}
//       />
//       <Text size={size} color="teal.600">
//         Loading...
//       </Text>
//     </VStack>
//   );
// };

// export default SpinnerUI;

import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Portal,
  useColorModeValue,
} from "@chakra-ui/react";

export default function SpinnerOverlay({
  isLoading,
  children,
  label = "Loading…",
  fullscreen = false,
  blur = "0.5px",
}) {
  return (
    <Box position="relative">
      {children}

      {isLoading &&
        (fullscreen ? (
          // Covers the entire viewport
          <Portal>
            <Center
              position="fixed"
              inset="0"
              bg={useColorModeValue("gray.50", "gray.800")}
              backdropFilter={`blur(${blur})`}
              zIndex="modal"
            >
              <VStack spacing={3}>
                <Spinner
                  size="xl"
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="teal.500"
                />
                {label && (
                  <Text fontSize="xl" color="teal.600">
                    {label}
                  </Text>
                )}
              </VStack>
            </Center>
          </Portal>
        ) : (
          // Covers only the parent box
          <Center
            minH="100vh"
            width="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={useColorModeValue("gray.50", "gray.800")}
            backdropFilter={`blur(${blur})`}
            zIndex="docked"
          >
            <VStack spacing={3}>
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="teal.500"
              />
              {label && (
                <Text fontSize="xl" color="teal.600">
                  {label}
                </Text>
              )}
            </VStack>
          </Center>
        ))}
    </Box>
  );
}
