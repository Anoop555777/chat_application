import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { MdDeleteOutline } from "react-icons/md";

import useUserToChannel from "./useUserToChannel";
import useUser from "./../authentication/useUser";
import useRemoveUserFromChannel from "./useRemoveUserFromChannel";

const ChannelUsers = ({ removeUser = false, onCloseModal }) => {
  const { channelMembers, isLoading } = useUserToChannel();
  const { user } = useUser();
  const { removeUserFromChannel, isPending } = useRemoveUserFromChannel();

  if (isLoading) return <Spinner />;

  function removeHandler(userId) {
    removeUserFromChannel(userId, {
      onSuccess: () => {
        onCloseModal?.();
      },
    });
  }

  return (
    <VStack align="stretch" spacing={3} mb={6} maxH="60vh" overflowY="auto">
      {channelMembers.map((member) => {
        return (
          <HStack
            key={member._id}
            p={1}
            bg="white"
            shadow="sm"
            borderRadius="md"
            spacing={2}
            cursor="pointer"
            border="1px solid #e2e8f0"
          >
            <Avatar size="sm" name={member.fullname} src={member.avatar} />
            <Box>
              <Text fontWeight="bold">{member.fullname}</Text>
              <Text fontSize="sm" color="gray.500">
                {member.email}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {member.role}
              </Text>
            </Box>
            {removeUser &&
              member.role !== "admin" &&
              user._id !== member._id && (
                <IconButton
                  marginLeft="auto"
                  icon={<MdDeleteOutline />}
                  bg="none"
                  border="none"
                  outline="none"
                  color="red"
                  size="lg"
                  cursor="pointer"
                  borderRadius="full"
                  _focus={{ boxShadow: "none" }}
                  transition="all 0.3s"
                  py={2}
                  onClick={() => removeHandler(member._id)}
                  isDisabled={isPending}
                />
              )}
          </HStack>
        );
      })}
    </VStack>
  );
};

export default ChannelUsers;
