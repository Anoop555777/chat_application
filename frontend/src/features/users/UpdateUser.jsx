import {
  Box,
  VStack,
  Avatar,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useState } from "react";

const UpdateUser = () => {
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?u=default");

  // Form hooks
  const { register: registerProfile, handleSubmit: handleProfileSubmit } =
    useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
  } = useForm();

  const newPassword = watch("newPassword");

  // Avatar upload preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // API calls
  const onUpdateProfile = (data) => {
    console.log("Profile Update:", { ...data, avatar });
    // await api.updateProfile({ fullname: data.fullname, avatar });
  };

  const onChangePassword = (data) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Password Update:", data);
    // await api.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
    >
      <Heading size="lg" mb={6} textAlign="center">
        Profile Settings
      </Heading>

      <VStack spacing={8} align="stretch">
        {/* ---------- PROFILE FORM ---------- */}
        <form onSubmit={handleProfileSubmit(onUpdateProfile)}>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel>Avatar</FormLabel>
              <Avatar size="xl" src={avatar} mb={2} />
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Enter full name"
                {...registerProfile("fullname")}
              />
            </FormControl>

            <Button type="submit" colorScheme="teal" width="full">
              Save Profile
            </Button>
          </VStack>
        </form>

        {/* ---------- PASSWORD FORM ---------- */}
        <form onSubmit={handlePasswordSubmit(onChangePassword)}>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter current password"
                {...registerPassword("currentPassword", { required: true })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                {...registerPassword("newPassword", {
                  required: true,
                  minLength: 6,
                })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Confirm New Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm new password"
                {...registerPassword("confirmPassword", { required: true })}
              />
            </FormControl>

            <Button type="submit" colorScheme="pink" width="full">
              Change Password
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default UpdateUser;
