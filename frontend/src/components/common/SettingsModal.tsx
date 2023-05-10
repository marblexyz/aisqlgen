import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { FC } from "react";
import { APIKeyInput } from "./APIKeyInput";

type SettingModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsModal: FC<SettingModalProps> = ({ isOpen, onClose }) => {
  const handleSave = () => {
    onClose();
  };
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Input your OpenAI Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={8}>
            <VStack
              w="100%"
              minH="48"
              h="100%"
              justifyContent={"center"}
              display="flex"
              spacing={4}
            >
              <APIKeyInput onSave={handleSave} />
              <Text textAlign="center">
                We do not upload, log, or store your API key outside of your
                browser storage.{" "}
              </Text>
            </VStack>
            <Button
              aria-label="Edit datasource"
              variant="unstyled"
              color={"red.500"}
              fontSize={"xs"}
              border={"1px solid"}
              borderColor={"red.500"}
              _hover={{
                bg: "red.50",
              }}
              display="flex"
              px={2}
              py={0}
              borderRadius={1}
              onClick={handleSignOut}
              w={60}
            >
              Sign out
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
