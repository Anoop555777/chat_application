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
import useUserToChannel from "../users/useUserToChannel";
import useUser from "../authentication/useUser";

const ChannelDetails = () => {
  const { channel, isLoading } = useChannel();
  const { channelMembers, isLoading: isFeching } = useUserToChannel();
  const { user } = useUser();
  const { exitChannel, isPending } = useExitChannel();
  const { deleteChannel, isDeleting } = useDeleteChannel();
  const { message } = useMessage();

  if (isLoading || isFeching) return <SpinnerUI isLoading={isLoading} />;
  if (!channel) return <Empty resource="channel" />;

  const twoUsers = channelMembers.length === 2;

  let avatar;
  if (twoUsers) {
    channelMembers.forEach((member) => {
      if (member._id !== user._id) {
        avatar = member?.avatar?.url;
      }
    });
  } else {
    avatar = channel?.avatar?.url;
  }

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
            <Avatar size="md" src={avatar} />
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
                      <CreateChannel
                        channelToEdit={channel}
                        isNotGroup={twoUsers}
                      />
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
