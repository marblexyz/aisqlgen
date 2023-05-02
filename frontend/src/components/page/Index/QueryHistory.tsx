import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { clearQueryHistory } from "@/redux/slices/queryHistory/queryHistorySlice";
import { selectQueryHistory } from "@/redux/slices/queryHistory/queryHistorySliceSelectors";
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

export const QueryHistory = () => {
  const queryHistory = useAppSelector(selectQueryHistory);
  const dispatch = useAppDispatch();
  const handleClearHistory = () => {
    dispatch(clearQueryHistory());
  };
  return (
    <Flex w="100%" justifyContent={"flex-start"}>
      <Popover placement="top-start">
        <PopoverTrigger>
          <Button
            p={0}
            my={0}
            h={8}
            w={32}
            borderRadius={0}
            textTransform={"uppercase"}
            mx={2}
            fontWeight={"bold"}
            color={"purple.500"}
            fontSize={"xs"}
            variant="outline"
            borderColor={"purple.500"}
          >
            Query History
          </Button>
        </PopoverTrigger>
        <PopoverContent w="lg" maxH="lg" borderRadius={0}>
          <PopoverArrow />
          <PopoverCloseButton _hover={{ backgroundColor: "none" }} />
          <PopoverHeader bg={"purple.50"}>
            <Text color="purple.500" fontWeight={"bold"} fontSize={"xs"}>
              History
            </Text>
          </PopoverHeader>
          <PopoverBody overflowY={"auto"}>
            <Box py={2}>
              <Text fontSize="md">{queryHistory.queries.length} queries</Text>
            </Box>
            <VStack alignItems={"left"}>
              {queryHistory.queries.length === 0 && (
                <Text color="gray.600" fontSize="md">
                  No queries exist.
                </Text>
              )}
              {queryHistory.queries.length > 0 && (
                <>
                  {queryHistory.queries.map((query, index) => (
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
                          <Text fontSize="md">{query.query}</Text>
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
              <Button variant="link" onClick={handleClearHistory}>
                Clear
              </Button>
            </Flex>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
