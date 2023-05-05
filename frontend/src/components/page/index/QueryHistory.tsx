import { ExecutionLog } from "@/types/redux/slices/query";
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
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
  return (
    <Flex justifyContent={"flex-start"}>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Button
            h={8}
            w={32}
            borderRadius={"sm"}
            textTransform={"uppercase"}
            fontWeight={"bold"}
            color={"purple.500"}
            fontSize={"xs"}
            variant="outline"
            borderColor={"purple.500"}
          >
            {`History: ${executionLog.length}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent w="container.md" maxH="container.md" borderRadius={0}>
          <PopoverArrow />
          <PopoverCloseButton _hover={{ backgroundColor: "none" }} />
          <PopoverHeader bg={"purple.50"}>
            <Text color="purple.500" fontWeight={"bold"} fontSize={"sm"}>
              History -{" "}
              {`${executionLog.length} quer${
                executionLog.length === 1 ? "y" : "ies"
              }`}
            </Text>
          </PopoverHeader>
          <PopoverBody overflowY={"auto"}>
            <VStack alignItems={"left"}>
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
                            color="purple.500"
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
                            color="purple.500"
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
          </PopoverBody>
          <PopoverFooter>
            <Flex justifyContent={"flex-end"}>
              <Button variant="link" onClick={onClearHistory}>
                Clear
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
