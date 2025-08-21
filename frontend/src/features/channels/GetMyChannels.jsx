import useChannelMy from "./useChannelMy";
import { Box, Flex, Text, Link } from "@chakra-ui/react";
import SpinnerUI from "./../../ui/SpinnerUI";
import { NavLink as ReactRouterNavLink } from "react-router-dom";

const GetMyChannels = () => {
  const { channels, isLoading } = useChannelMy();
  if (isLoading) return <SpinnerUI isLoading={isLoading} />;

  if (channels.length === 0)
    return (
      <Flex align="center" p="4" mx="4" borderRadius="lg">
        <Text>No channels found</Text>
      </Flex>
    );

  return (
    <Flex direction="column" gap="1">
      {channels.map((channel) => (
        <NavItem key={channel._id} link={channel._id}>
          {channel.name}
        </NavItem>
      ))}
    </Flex>
  );
};

const NavItem = ({ link, children }) => {
  return (
    <Link
      p="4"
      fontSize="lg"
      fontWeight="bold"
      mx="4"
      borderRadius="lg"
      as={ReactRouterNavLink}
      to={`/channel/${link}`}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      _activeLink={{ bg: "cyan.400", color: "white" }}
      display="block"
      _hover={{
        bg: "cyan.400",
        color: "white",
      }}
    >
      {children}
    </Link>
  );
};

export default GetMyChannels;
