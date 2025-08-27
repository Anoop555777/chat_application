import useChannel from "./useChannel";
import SpinnerUI from "./../../ui/SpinnerUI";
import Empty from "../../ui/Empty";
import {
  Avatar,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  VStack,
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ChatInput from "../../ui/ChatInput";
import useMessage from "../messages/useMessage";
import MessageList from "../messages/MessageList";
import Modal from "../../ui/Modal";
import useExitChannel from "./useExitChannel";
import useDeleteChannel from "./useDeleteChannel";
import CreateChannel from "./CreateChannel";
import AddUserToChannel from "../users/AddUserToChannel";
import ChannelUsers from "../users/ChannelUsers";

const ChannelDetails = () => {
  const { channel, isLoading } = useChannel();
  const { exitChannel, isPending } = useExitChannel();
  const { deleteChannel, isDeleting } = useDeleteChannel();

  const { message } = useMessage();

  if (isLoading) return <SpinnerUI isLoading={isLoading} />;
  if (!channel) return <Empty resource="channel" />;

  const handleSendMessage = (text) => {
    message({ channelId: channel._id, text });
  };

  return (
    <Box position="relative">
      <Flex
        height="20"
        p={4}
        alignItems="center"
        bg={useColorModeValue("gray.200", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent={{ base: "space-between", md: "space-between" }}
      >
        <Flex alignItems={"center"} justifyContent="space-between">
          <HStack gap="4">
            <Avatar
              size="md"
              src={
                "https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
              }
            />
            <VStack alignItems="flex-start" spacing="1px">
              <Text fontSize="lg">{channel.name}</Text>
              <Text fontSize="sm">{channel.description}</Text>
              {channel.role === "admin" && <Text fontSize="sm">Admin</Text>}
            </VStack>
          </HStack>
        </Flex>
        {/* <IconButton
          icon={<BiDotsVerticalRounded />}
          bg="none"
          border="none"
          outline="none"
          size="lg"
          borderRadius="full"
          _focus={{ boxShadow: "none" }}
        /> */}

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<BiDotsVerticalRounded />}
            bg="none"
            border="none"
            outline="none"
            size="lg"
            borderRadius="full"
            _focus={{ boxShadow: "none" }}
            transition="all 0.3s"
            py={2}
          />

          <MenuList
            bg={useColorModeValue("white", "gray.900")}
            borderColor={useColorModeValue("gray.200", "gray.700")}
          >
            {channel.role === "admin" && (
              <>
                <Modal>
                  <Modal.Open>
                    <MenuItem>Edit Channel</MenuItem>
                  </Modal.Open>
                  <Modal.Window>
                    <Modal.Header>Edit Channel</Modal.Header>
                    <Modal.Body>
                      <CreateChannel channelToEdit={channel} />
                    </Modal.Body>
                  </Modal.Window>
                </Modal>

                <Modal>
                  <Modal.Open>
                    <MenuItem>Add User To Channel</MenuItem>
                  </Modal.Open>
                  <Modal.Window>
                    <Modal.Header>Add User To Channel</Modal.Header>
                    <Modal.Body>
                      <AddUserToChannel />
                    </Modal.Body>
                  </Modal.Window>
                </Modal>

                <Modal>
                  <Modal.Open>
                    <MenuItem>Delete Channel</MenuItem>
                  </Modal.Open>
                  <Modal.Window>
                    <Modal.Header>Exit Channel</Modal.Header>
                    <Modal.Body>
                      <Text>
                        Are you sure you want to delete this {channel.name}{" "}
                        Channel permanently? This action cannot be undone.
                      </Text>
                    </Modal.Body>
                    <Modal.Footer>
                      <Modal.Close />
                      <Button
                        colorScheme="red"
                        onClick={() => deleteChannel(channel._id)}
                        isLoading={isDeleting}
                        isDisabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal.Window>
                </Modal>
                <Modal>
                  <Modal.Open>
                    <MenuItem>Remove User From Channel</MenuItem>
                  </Modal.Open>
                  <Modal.Window>
                    <Modal.Header>Remove User</Modal.Header>
                    <Modal.Body>
                      <ChannelUsers removeUser={true} />
                    </Modal.Body>
                  </Modal.Window>
                </Modal>
              </>
            )}

            <Modal>
              <Modal.Open>
                <MenuItem>Exit Channel</MenuItem>
              </Modal.Open>
              <Modal.Window>
                <Modal.Header>Exit Channel</Modal.Header>
                <Modal.Body>
                  <Text>
                    Are you sure you want to exit this {channel.name} Channel
                    permanently? This action cannot be undone.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close />
                  <Button
                    colorScheme="red"
                    onClick={() => exitChannel(channel._id)}
                    isLoading={isPending}
                    isDisabled={isPending}
                  >
                    Exit
                  </Button>
                </Modal.Footer>
              </Modal.Window>
            </Modal>
            <Modal>
              <Modal.Open>
                <MenuItem>Channel Members</MenuItem>
              </Modal.Open>
              <Modal.Window>
                <Modal.Header>Channel Members</Modal.Header>
                <Modal.Body>
                  <ChannelUsers />
                </Modal.Body>
              </Modal.Window>
            </Modal>
          </MenuList>
        </Menu>
      </Flex>
      <MessageList messages={channel.messages} />
      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default ChannelDetails;
