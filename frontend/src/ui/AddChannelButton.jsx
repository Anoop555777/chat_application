import { IconButton, Button, Box } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Modal from "./Modal";
import CreateChannel from "../features/channels/CreateChannel";

const AddChannelButton = ({ variant }) => {
  return (
    <Modal>
      <Modal.Open>
        {variant === "mobile" ? (
          // 📱 Mobile: FAB floating at bottom-left of screen
          <Box
            position="fixed"
            bottom="20"
            left="4"
            zIndex="1000"
            display={{ base: "block", md: "none" }}
          >
            <IconButton
              icon={<AddIcon />}
              colorScheme="teal"
              aria-label="Add Channel"
              borderRadius="full"
              size="lg"
              shadow="lg"
            />
          </Box>
        ) : (
          // 💻 Desktop: Normal sidebar button
          <Button
            leftIcon={<AddIcon />}
            bg="teal.500"
            aria-label="Add Channel"
            size="sm"
            color="white"
            alignSelf="flex-end"
            border="none"
            mr={2}
            _hover={{
              bg: "teal.700",
              color: "white",
            }}
          >
            Add Channel
          </Button>
        )}
      </Modal.Open>

      <Modal.Window>
        <Modal.Header>Add Channel</Modal.Header>
        <Modal.Body>
          <CreateChannel />
        </Modal.Body>
      </Modal.Window>
    </Modal>
  );
};

export default AddChannelButton;
