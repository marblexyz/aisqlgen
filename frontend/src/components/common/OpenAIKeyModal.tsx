import {
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
import { FC } from "react";
import { APIKeyInput } from "./APIKeyInput";

type OpenAIKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const OpenAIKeyModal: FC<OpenAIKeyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleSave = () => {
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Input your OpenAI Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
