// import {
//   Modal as ChakraModal,
//   Text,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
//   Button,
// } from "@chakra-ui/react";

import { cloneElement, createContext, useContext } from "react";
import {
  useDisclosure,
  Modal as ChakraModal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

const ModalContext = createContext();

const Overlay = () => (
  <ModalOverlay
    bg="none"
    backdropFilter="blur(4px) hue-rotate(10deg)"
    backdropInvert="80%"
    backdropBlur="2px"
  />
);

const Modal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <ModalContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </ModalContext.Provider>
  );
};

function Window({ children }) {
  const { isOpen, onClose } = useContext(ModalContext);
  return (
    <ChakraModal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <Overlay />
      <ModalContent>
        <ModalCloseButton />
        {children}
      </ModalContent>
    </ChakraModal>
  );
}

function Open({ children }) {
  const { onOpen } = useContext(ModalContext);

  return cloneElement(children, {
    onClick: () => onOpen(),
  });
}

function Header({ children }) {
  return <ModalHeader fontWeight="bold">{children}</ModalHeader>;
}

function Body({ children }) {
  return <ModalBody>{children}</ModalBody>;
}

function Footer({ children }) {
  return <ModalFooter>{children}</ModalFooter>;
}

function Close() {
  const { onClose } = useContext(ModalContext);
  return (
    <Button mr={3} onClick={onClose}>
      Close
    </Button>
  );
}

Modal.Window = Window;
Modal.Open = Open;
Modal.Header = Header;
Modal.Body = Body;
Modal.Footer = Footer;
Modal.Close = Close;

export default Modal;
