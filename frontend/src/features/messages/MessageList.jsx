import { useEffect, useRef } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import useUser from "./../authentication/useUser";

export default function MessageList({ messages }) {
  const { user } = useUser();
  const endOfMessagesRef = useRef(null);

  // Scroll to the last message whenever new messages arrive
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <VStack
      spacing={3}
      align="stretch"
      paddingTop={4}
      px={4}
      pb={20} // leave space for chat input at bottom
      overflowY="auto"
      height="calc(100vh - 100px)" // adjust to fit your layout
    >
      {messages.map((msg) => {
        const isMine = msg.sender._id === user._id;

        return (
          <Box
            key={msg._id}
            maxW="70%"
            alignSelf={isMine ? "flex-end" : "flex-start"}
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
        );
      })}

      {/* Invisible div used to auto-scroll to bottom */}
      <div ref={endOfMessagesRef} />
    </VStack>
  );
}
