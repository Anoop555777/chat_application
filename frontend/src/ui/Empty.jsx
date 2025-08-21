import { Text } from "@chakra-ui/react";

const Empty = ({ resource }) => {
  return (
    <Text fontSize="xl" color="gray.500" fontWeight="semibold" mt={4}>
      {resource} could not be found.
    </Text>
  );
};

export default Empty;
