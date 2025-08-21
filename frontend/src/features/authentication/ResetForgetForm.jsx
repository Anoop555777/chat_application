import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { useState } from "react";
import useResetPassword from "./useResetPassword";
import { useParams } from "react-router-dom";

const ResetForgetForm = () => {
  const { reset_token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const resetPasswordHandler = (data) => {
    resetPassword(
      { data, reset_token },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <form onSubmit={handleSubmit(resetPasswordHandler)}>
        <VStack
          spacing={5}
          p={6}
          bg="white"
          rounded="xl"
          shadow="md"
          width="sm"
        >
          <Text fontSize="2xl" fontWeight="bold">
            Reset Your Password
          </Text>
          <FormControl isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                id="password"
                {...register("password", {
                  required: "Password is Required",
                  minLength: {
                    value: 8,
                    message: "password must have atleast 8 character",
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/i,
                    message:
                      "Password must contain atleast 1UpperLetter 1SpecialCharacter 1Number",
                  },
                })}
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.password && errors.password.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    getValues().password == value || "password must be matched",
                })}
              />
            </InputGroup>
            <FormErrorMessage>
              {errors.confirmPassword && errors.confirmPassword.message}
            </FormErrorMessage>
          </FormControl>
          <Button
            colorScheme="blue"
            width="full"
            isLoading={isPending}
            type="submit"
          >
            Resend Code
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default ResetForgetForm;
