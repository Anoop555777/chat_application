import {
  Box,
  VStack,
  Avatar,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Flex,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useUser from "./../authentication/useUser";

import { useNavigate } from "react-router-dom";
import useUpdatePassword from "./useUpdatePassword";
import SpinnerUI from "./../../ui/SpinnerUI";
import useUpdateProfile from "./useUpdateProfile";

const UpdateUser = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useUser();
  const { updatePassword, isUpdating } = useUpdatePassword();
  const [showPassword, setShowPassword] = useState(false);
  const { updateProfile, isPending } = useUpdateProfile();

  // Form hooks
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    // formState: { error: profileError },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordError },
    getValues,
    reset: resetPassword,
  } = useForm();

  if (isLoading) return <SpinnerUI fullscreen={true} isLoading={isLoading} />;

  if (!isAuthenticated) {
    navigate("/login");
  }

  // API calls
  const onUpdateProfile = (data) => {
    const formData = new FormData();
    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0]); // 👈 must match multer field name
    }
    formData.append("fullname", data.fullname);
    updateProfile(formData);
  };

  const onChangePassword = (data) => {
    updatePassword(data, {
      onSuccess: () => {
        resetPassword();
      },
    });
  };

  return (
    <>
      <Flex align="center" justify="space-between" m={6}>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <Heading size="lg" textAlign="center">
          Profile Settings
        </Heading>
        <Box w="16" /> {/* spacer so heading stays centered */}
      </Flex>
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={6}
        align="flex-start"
        justify="center"
      >
        <Box
          flex="1"
          maxW="md"
          mx="auto"
          p={6}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          width="100%"
        >
          {/* ---------- PROFILE FORM ---------- */}
          <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
            <VStack spacing={5}>
              <FormControl>
                <FormLabel>Avatar</FormLabel>
                <Avatar size="xl" src={user?.avatar?.url} mb={2} />
                <Input
                  type="file"
                  id="avatar"
                  name="avatar"
                  accept="image/*"
                  {...registerProfile("avatar")}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  defaultValue={user.fullname}
                  placeholder="Enter full name"
                  {...registerProfile("fullname")}
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="full"
                isLoading={isPending}
              >
                Save Profile
              </Button>
            </VStack>
          </form>
        </Box>
        <Box
          flex="1"
          maxW="md"
          mx="auto"
          p={6}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          width="100%"
        >
          {/* ---------- PASSWORD FORM ---------- */}
          <form onSubmit={handlePasswordSubmit(onChangePassword)}>
            <VStack spacing={5}>
              <FormControl isInvalid={passwordError.currentPassword}>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="currentPassword"
                    {...registerPassword("currentPassword", {
                      required: "Password is Required",
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
                  {passwordError.currentPassword &&
                    passwordError.currentPassword.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={passwordError.password}>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="password"
                    {...registerPassword("password", {
                      required: "New Password Is Required",
                      minLength: {
                        value: 8,
                        message: "password must have atleast 8 character",
                      },
                      pattern: {
                        value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/i,
                        message:
                          "Password must contain atleast 1UpperLetter 1SpecialCharacter 1Number",
                      },
                      validate: (value) =>
                        getValues().confirmPassword !== value ||
                        "password must be diffrent then your current password",
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
                  {passwordError.password && passwordError.password.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={passwordError.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerPassword("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        getValues().password == value ||
                        "password must be matched",
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {passwordError.confirmPassword &&
                    passwordError.confirmPassword.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                type="submit"
                isLoading={isUpdating}
                isDisabled={isUpdating}
                colorScheme="teal"
                width="full"
              >
                Change Password
              </Button>
            </VStack>
          </form>
        </Box>
      </Stack>
    </>
  );
};

export default UpdateUser;
