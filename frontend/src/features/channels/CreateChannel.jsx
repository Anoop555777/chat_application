import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import GetAllFriends from "../users/GetAllFriends";
import { useState } from "react";
import Modal from "../../ui/Modal";
import AddUserEmail from "../users/AddUserEmail";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useCreateChannel from "./useCreateChannel";
import useEditChannel from "./useEditChannel";

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

  return (
    <Box p={2}>
      <Heading size="lg" mb={4}>
        Channel Members
      </Heading>
      {!isEditSession && (
        <>
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
