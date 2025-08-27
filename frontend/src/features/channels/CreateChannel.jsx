import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import GetAllFriends from "../users/GetAllFriends";
import { useState } from "react";
import Modal from "../../ui/Modal";
import AddUserEmail from "../users/AddUserEmail";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useCreateChannel from "./useCreateChannel";
import useEditChannel from "./useEditChannel";
import { CloseIcon } from "@chakra-ui/icons";

const CreateChannel = ({ channelToEdit = {}, onCloseModal }) => {
  const { _id: editId, ...editValues } = channelToEdit;
  const isEditSession = Boolean(editId);
  const [addMembers, setAddMembers] = useState([]);
  const { createChannel, isPending } = useCreateChannel();
  const { editChannel, isEditing } = useEditChannel();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  function onSubmitHandler(data) {
    if (isEditSession) {
      editChannel(
        { channelId: editId, data },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    } else {
      if (!addMembers.length) {
        toast.error("Please add atleast members to create channel");
        return;
      }
      createChannel(
        { ...data, members: addMembers },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    }
  }

  const handleRemove = (email) => {
    setAddMembers((prev) => prev.filter((m) => m !== email));
  };

  return (
    <Box py={1}>
      <Heading size="lg" mb={4}>
        Channel Members
      </Heading>

      {!isEditSession && (
        <>
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
            setAddMembers={setAddMembers}
            addMembers={addMembers}
          />
          <AddUserEmail addMembers={addMembers} setAddMembers={setAddMembers} />
        </>
      )}
      <Stack spacing={2} mt={2}>
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <FormControl isInvalid={errors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Group Name"
              id="name"
              {...register("name", {
                required: "Please enter your name",
              })}
            />
            <FormErrorMessage>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              type="text"
              placeholder="Describe your channel"
              id="description"
              {...register("description")}
            />
            <FormErrorMessage>
              {errors.description && errors.description.message}
            </FormErrorMessage>
          </FormControl>

          <Modal.Footer>
            <Modal.Close />
            <Button
              colorScheme="teal"
              p={2}
              type="submit"
              isLoading={isPending || isEditing}
            >
              {isEditSession ? "Edit Channel" : "Create Channel"}
            </Button>
          </Modal.Footer>
        </form>
      </Stack>
    </Box>
  );
};

export default CreateChannel;
