import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

export default function ResendVerificationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  // React Query mutation to call backend
  const mutation = useMutation({
    mutationFn: async (email) => {
      const { data } = await axios.post("/api/v1/auth/resendVerification", {
        email,
      });

      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });

  const forgetPasswordHandler = ({ email }) => {
    mutation.mutate(email);
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <form onSubmit={handleSubmit(forgetPasswordHandler)}>
        <VStack
          spacing={5}
          p={6}
          bg="white"
          rounded="xl"
          shadow="md"
          width="sm"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Resend Verification Code
          </Text>
          <FormControl isInvalid={errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            <FormErrorMessage>
              {errors.email && errors.email.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="blue"
            width="full"
            isLoading={mutation.isPending}
            type="submit"
          >
            Resend Code
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
