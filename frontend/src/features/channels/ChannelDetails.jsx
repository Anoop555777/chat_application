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
} from "@chakra-ui/react";
import ChatInput from "../../ui/ChatInput";
import useMessage from "../messages/useMessage";
import MessageList from "../messages/MessageList";

const ChannelDetails = () => {
  const { channel, isLoading } = useChannel();

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
        alignItems="center"
        bg={useColorModeValue("gray.200", "gray.900")}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent={{ base: "flex-start", md: "flex-start" }}
      >
        <Flex alignItems={"center"} p="4">
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
            </VStack>
          </HStack>
        </Flex>
      </Flex>
      <MessageList messages={channel.messages} />
      <ChatInput onSend={handleSendMessage} />
    </Box>
  );
};

export default ChannelDetails;
