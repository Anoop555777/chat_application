import { useState } from "react";
import { Box, Input, IconButton, HStack } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="white"
      px={4}
      py={3}
      borderTop="1px solid"
      borderColor="gray.200"
    >
      <HStack spacing={2}>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          bg="gray.50"
          _focus={{ bg: "white" }}
        />
        <IconButton
          aria-label="Send message"
          icon={<IoMdSend size={20} />}
          onClick={handleSend}
          colorScheme="blue"
          rounded="full"
        />
      </HStack>
    </Box>
  );
}
