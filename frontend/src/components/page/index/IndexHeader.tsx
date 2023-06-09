import {
  Box,
  Circle,
  Flex,
  HStack,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoCheckmark } from "react-icons/io5";

export const IndexHeader = () => {
  return (
    <Flex justifyContent="center" w={"100%"} bg={"gray.50"} py={6} px={4}>
      <Stack
        direction={{ base: "column", md: "row" }}
        h={"100%"}
        w="100%"
        maxW={"container.lg"}
        spacing={2}
        alignSelf={"center"}
        justifyContent={"space-between"}
      >
        <VStack h={"100%"} w={"100%"} justify={"end"} spacing={8}>
          <Heading color={"purple.500"}>Generate SQL queries using AI</Heading>
          <Heading
            size={"md"}
            color={"gray.500"}
            fontWeight={"normal"}
            lineHeight={"base"}
          >
            Complicated joins? Difficult aggregations? Generate SQL queries
            automagically with AI.
          </Heading>
        </VStack>
        <Box
          w={"100%"}
          h={"100%"}
          display="flex"
          alignItems={"end"}
          justifyContent={{ base: "start", md: "end" }}
        >
          <VStack
            bg={"gray.900"}
            p={6}
            borderRadius={4}
            color="gray.100"
            fontSize={"md"}
            spacing={2}
            textAlign={"left"}
            justify={"end"}
          >
            <HStack w={"100%"}>
              <Circle bg="purple.500">
                <Icon as={IoCheckmark} />
              </Circle>
              <Text>Connect your data directly</Text>
            </HStack>
            <HStack w={"100%"}>
              <Circle bg="purple.500">
                <Icon as={IoCheckmark} />
              </Circle>
              <Text>Write your questions in natural language</Text>
            </HStack>
            <HStack w={"100%"}>
              <Circle bg="purple.500">
                <Icon as={IoCheckmark} />
              </Circle>
              <Text>Query multiple data sources at once</Text>
            </HStack>
          </VStack>
        </Box>
      </Stack>
    </Flex>
  );
};
