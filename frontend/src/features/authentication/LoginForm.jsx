import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  Link,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useLogin from "./useLogin";
import useSignup from "./useSignup";

export default function AuthCard() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, getValues, formState, reset } = useForm();
  const { login, isLoging } = useLogin();
  const { signup, isSignin } = useSignup();
  const { errors } = formState;
  function onSubmitHandler(data) {
    if (!isSignUp)
      login(data, {
        onSuccess: () => {
          reset();
        },
      });
    else
      signup(data, {
        onSuccess: () => {
          reset();
        },
      });
  }
  // eslint-disable-next-line no-unused-vars
  function onErrorHandler(err) {}
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
      px={4}
    >
      <Stack spacing={8} mx="auto" w="full" maxW="md" py={12}>
        <Stack align="center">
          <Heading fontSize="4xl" textAlign="center">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </Heading>
        </Stack>
        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
          w="full"
          maxW="md"
          transition="all 0.3s"
        >
          <Stack spacing={4}>
            <form onSubmit={handleSubmit(onSubmitHandler, onErrorHandler)}>
              {isSignUp && (
                <FormControl isInvalid={errors.name}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="your name"
                    id="fullname"
                    {...register("fullname", {
                      required: "Please enter your name",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.name && errors.name.message}
                  </FormErrorMessage>
                </FormControl>
              )}

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

              {isSignUp && (
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
                          getValues().password == value ||
                          "password must be matched",
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.confirmPassword && errors.confirmPassword.message}
                  </FormErrorMessage>
                </FormControl>
              )}
              {!isSignUp && (
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align="start"
                  justify="space-between"
                >
                  <Checkbox>Remember me</Checkbox>
                  <Link href="/forget-password" color="blue.400">
                    Forgot password?
                  </Link>
                </Stack>
              )}
              <Button
                type="submit"
                mt={4}
                bg="blue.400"
                color="white"
                _hover={{ bg: "blue.500" }}
                isLoading={isLoging || isSignin}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>

              <Text fontSize="sm" textAlign="center">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <Button
                  variant="link"
                  color="blue.400"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Button>
              </Text>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
