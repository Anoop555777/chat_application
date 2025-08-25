import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";

import useMembers from "./useMembers";

const GetAllFriends = ({ setAddMembers, addMembers }) => {
  const { members, isLoading } = useMembers();

  if (isLoading) return null;

  const handleClick = (email) => {
    if (addMembers.includes(email)) {
      // remove member (unclick)
      setAddMembers((prev) => prev.filter((allEmail) => allEmail !== email));
    } else {
      // add member
      setAddMembers((prev) => [...prev, email]);
    }
  };

  return (
    <VStack align="stretch" spacing={3} mb={6} maxH="150px" overflowY="auto">
      {members.map((member) => {
        const isSelected = addMembers.includes(member.email);
        return (
          <HStack
            key={member._id}
            p={3}
            bg={isSelected ? "teal.50" : "white"}
            shadow="sm"
            borderRadius="md"
            spacing={4}
            cursor="pointer"
            border={isSelected ? "2px solid teal" : "1px solid #e2e8f0"}
            onClick={() => handleClick(member.email)}
          >
            <Avatar size="sm" name={member.fullname} src={member.avatar} />
            <Box>
              <Text fontWeight="bold">{member.fullname}</Text>
              <Text fontSize="sm" color="gray.500">
                {member.email}
              </Text>
            </Box>
          </HStack>
        );
      })}
    </VStack>
  );
};

export default GetAllFriends;
