import { useAppSelector } from "@/hooks/reduxHooks";
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
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from "@chakra-ui/react";

export const ExecutionHistory = () => {
  const queryHistory = useAppSelector(selectQueryHistory);

  return (
    <Flex w="100%" justifyContent={"flex-start"}>
      <Popover>
        <PopoverTrigger>
          <Button fontSize={"md"} p={0} my={0} h={8} w={32} borderRadius={"sm"}>
            History
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>History</PopoverHeader>
          <PopoverBody>
            <VStack alignItems={"left"}>
              {queryHistory.queries.length > 0 && (
                <>
                  {queryHistory.queries.map((query, index) => (
                    <Box
                      key={index}
                      w="100%"
                      border={"1px solid"}
                      borderColor={"gray.100"}
                      boxShadow={"xs"}
                      borderRadius={"sm"}
                      p={2}
                    >
                      <VStack w="100%" alignItems="left">
                        <Text fontSize="sm">
                          {new Date(query.timestamp).toLocaleDateString() +
                            " " +
                            new Date(query.timestamp).toLocaleTimeString()}
                        </Text>
                        <Text fontSize="md">{query.userQuestion}</Text>
                        <Text fontSize="md">{query.query}</Text>
                      </VStack>
                    </Box>
                  ))}
                </>
              )}
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Flex>
  );
};
