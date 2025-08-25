import { Box, Button, HStack, IconButton, Text } from "@chakra-ui/react";
import useUser from "../authentication/useUser";
import { MdDeleteOutline } from "react-icons/md";
import Modal from "../../ui/Modal";
import useDeleteMessage from "./useDeleteMessage";

const Message = ({ msg }) => {
  const { deleteMessage, isDeleting } = useDeleteMessage();
  const { user } = useUser();
  const isMine = msg.sender._id === user._id;
  return (
    <Box maxW="70%" alignSelf={isMine ? "flex-end" : "flex-start"}>
      <HStack>
        {isMine && (
          <Modal>
            <Modal.Open>
              <IconButton
                size="sm"
                aria-label="Send message"
                icon={<MdDeleteOutline size={18} />}
                colorScheme="blue"
                variant="outline"
                rounded="full"
              />
            </Modal.Open>
            <Modal.Window>
              <Modal.Header>Delete Message</Modal.Header>
              <Modal.Body>
                <Text>
                  Are you sure you want to delete this message permanently? This
                  action cannot be undone.
                </Text>
              </Modal.Body>
              <Modal.Footer>
                <Modal.Close />
                <Button
                  colorScheme="red"
                  onClick={() =>
                    deleteMessage({
                      id: msg._id,
                      channelId: msg.channel,
                    })
                  }
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </Modal.Footer>
            </Modal.Window>
          </Modal>
        )}
        <Box
          bg={isMine ? "blue.500" : "gray.200"}
          color={isMine ? "white" : "black"}
          px={4}
          py={2}
          borderRadius="lg"
          boxShadow="sm"
        >
          {!isMine ? (
            <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={1}>
              {msg.sender.fullname || "User"}
            </Text>
          ) : (
            <Text fontSize="xs" fontWeight="bold" color="gray.100" mb={1}>
              You
            </Text>
          )}

          <Text>{msg.content}</Text>
          <Text fontSize="xs" opacity={0.7} mt={1} textAlign="right">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};

export default Message;
