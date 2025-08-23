import { useEffect, useRef } from "react";
import { VStack } from "@chakra-ui/react";

import Message from "./Message";

export default function MessageList({ messages }) {
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
      {messages.map((msg) => (
        <Message key={msg._id} msg={msg} />
      ))}

      {/* Invisible div used to auto-scroll to bottom */}
      <div ref={endOfMessagesRef} />
    </VStack>
  );
}
