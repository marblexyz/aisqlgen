import { ExecutionLog } from "@/types/redux/slices/query";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";

type QueryHistoryProps = {
  executionLog: ExecutionLog[];
  onClearHistory?: () => void;
};

export const QueryHistory: FC<QueryHistoryProps> = ({
  executionLog,
  onClearHistory,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        h={8}
        w={32}
        borderRadius={"sm"}
        color={"purple.500"}
        fontSize={"xs"}
        variant="outline"
        borderColor={"purple.500"}
        onClick={onOpen}
      >
        {`History: ${executionLog.length}`}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent
          w="100%"
          maxW="container.md"
          maxH="container.md"
          borderRadius={0}
        >
          <ModalCloseButton _hover={{ backgroundColor: "none" }} />
          <ModalHeader bg={"purple.50"}>
            <Text color="purple.500" fontWeight={"bold"} fontSize={"sm"}>
              History -{" "}
              {`${executionLog.length} quer${
                executionLog.length === 1 ? "y" : "ies"
              }`}
            </Text>
          </ModalHeader>
          <ModalBody w="100%" overflowY={"auto"}>
            <VStack w="100%" alignItems={"left"} spacing={2}>
              {executionLog.length === 0 && (
                <Text color="gray.600" fontSize="md">
                  No queries exist.
                </Text>
              )}
              {executionLog.length > 0 && (
                <>
                  {executionLog.map((query, index) => (
                    <Box
                      key={index}
                      w="100%"
                      border={"1px solid"}
                      borderColor={"gray.100"}
                      p={2}
                    >
                      <VStack w="100%" alignItems="left">
                        <Text fontSize="sm" color="gray.500">
                          {new Date(query.timestamp).toLocaleDateString() +
                            " " +
                            new Date(query.timestamp).toLocaleTimeString()}
                        </Text>
                        <VStack w="100%" alignItems={"left"} spacing={0}>
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            textTransform={"uppercase"}
                            fontWeight={"bold"}
                          >
                            Question
                          </Text>
                          <Text fontSize="md">{query.userQuestion}</Text>
                        </VStack>
                        <VStack w="100%" alignItems={"left"} spacing={0}>
                          <Text
                            fontSize="xs"
                            color="gray.400"
                            textTransform={"uppercase"}
                            fontWeight={"bold"}
                          >
                            Query
                          </Text>
                          <Text fontSize="md">{query.command}</Text>
                        </VStack>
                      </VStack>
                    </Box>
                  ))}
                </>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Flex justifyContent={"flex-end"}>
              <Button variant="link" onClick={onClearHistory}>
                Clear
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
