import { Button, HStack, Input } from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import useUser from "../authentication/useUser";
const AddUserEmail = ({ addMembers, setAddMembers }) => {
  const { user } = useUser();
  const [newUserId, setNewUserId] = useState("");

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleIde = () => {
    if (!newUserId.trim()) return;

    if (user.email === newUserId) {
      toast.error("You cannot add yourself as a friend");
      return;
    }

    if (!isValidEmail(newUserId)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (addMembers.includes(newUserId)) {
      toast.error("User already added");
      return;
    }

    toast.success("User added successfully");
    setAddMembers((prev) => [...prev, newUserId]);
    setNewUserId("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleIde();
    }
  };

  return (
    <HStack>
      <Input
        type="email"
        placeholder="please enter your friend's email ids"
        value={newUserId}
        onChange={(e) => setNewUserId(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Button onClick={handleIde} colorScheme="teal">
        Add
      </Button>
    </HStack>
  );
};

export default AddUserEmail;
