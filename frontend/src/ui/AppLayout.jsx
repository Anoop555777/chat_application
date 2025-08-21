import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import SidebarWithHeader from "./SideBar";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <SidebarWithHeader onClose={onClose} isOpen={isOpen}>
      <Header onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>
        <Outlet />
      </Box>
    </SidebarWithHeader>
  );
};

export default AppLayout;
