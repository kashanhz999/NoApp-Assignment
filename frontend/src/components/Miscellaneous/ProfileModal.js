import React from "react";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
  Center
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent h="410px">
          <ModalHeader fontSize={"35px"} d={"flex"} justifyContent={"center"}>
            <Center>{user.name}</Center>
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            d="flex"
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Center>
              <Image
                borderRadius={"full"}
                boxSize={"150px"}
                src={user.pic}
                alt={user.name}
                marginBottom={"30px"}
              />
            </Center>
            <Center>
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Poppins"
              >
                {user.email}
              </Text>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" justifySelf={"center"} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
