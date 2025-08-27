import { useState } from "react";
import GetAllFriends from "./GetAllFriends";
import useUserToChannel from "./useUserToChannel";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import AddUserEmail from "./AddUserEmail";
import Modal from "../../ui/Modal";
import useAddUserToChannel from "./useAddUserToChannel";
const AddUserToChannel = ({ onCloseModal }) => {
  const [addMembers, setAddMembers] = useState([]);
  const { channelMembers, isLoading } = useUserToChannel();
  const { addUserToChannel, isPending } = useAddUserToChannel();

  if (isLoading) return null;
  const handleRemove = (email) => {
    setAddMembers((prev) => prev.filter((m) => m !== email));
  };

  function handleSubmit() {
    addUserToChannel(addMembers, {
      onSuccess: () => {
        onCloseModal?.();
        setAddMembers([]);
      },
    });
  }

  return (
    <Box p={2}>
      {addMembers.length > 0 && (
        <Flex mb={4} gap={3} wrap="wrap">
          {addMembers.map((email) => (
            <VStack
              position="relative"
              key={email}
              spacing={1}
              bg="teal.50"
              px={3}
              py={1}
              shadow="sm"
            >
              <Avatar size="sm" name={email} />
              <Text fontSize="sm">{`${email.slice(0, 3)}...`}</Text>
              <IconButton
                size="xs"
                position="absolute"
                right="-1"
                top="-1"
                icon={<CloseIcon />}
                aria-label="remove"
                onClick={() => handleRemove(email)}
                bg="none"
                zIndex="10"
              />
            </VStack>
          ))}
        </Flex>
      )}
      <GetAllFriends
        channelMembers={channelMembers}
        addMembers={addMembers}
        setAddMembers={setAddMembers}
      />
      <AddUserEmail
        addMembers={addMembers}
        setAddMembers={setAddMembers}
        channelMembers={channelMembers}
      />

      <Modal.Footer>
        <Modal.Close />
        <Button
          colorScheme="teal"
          p={2}
          type="submit"
          disabled={isPending}
          isLoading={isPending}
          onClick={handleSubmit}
        >
          Add Users
        </Button>
      </Modal.Footer>
    </Box>
  );
};

export default AddUserToChannel;
