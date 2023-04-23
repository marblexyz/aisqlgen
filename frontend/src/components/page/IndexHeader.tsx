import {
  Box,
  Circle,
  Flex,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IoCheckmark } from "react-icons/io5";

export const IndexHeader = () => {
  return (
    <Flex
      w={"100%"}
      bg={"gray.700"}
      align={"center"}
      justify={"center"}
      pt={{ base: 8, md: 16 }}
      pb={{ base: 8, md: 16 }}
      px={4}
    >
      <SimpleGrid
        h={"100%"}
        w={"100%"}
        maxW={"container.lg"}
        minChildWidth={48}
        spacing={2}
      >
        <VStack h={"100%"} w={"100%"} justify={"end"} spacing={8}>
          <Heading color={"gray.100"}>Generate SQL queries using AI</Heading>
          <Heading
            size={"md"}
            color={"gray.400"}
            fontWeight={"medium"}
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
          justifyContent={{ base: "start", md: "center" }}
        >
          <VStack
            bg={"gray.900"}
            p={6}
            borderRadius={4}
            color="gray.100"
            fontSize={"sm"}
            spacing={2}
            textAlign={"left"}
            justify={"end"}
          >
            <HStack w={"100%"}>
              <Circle bg="purple.500">
                <Icon as={IoCheckmark} w={"75%"} />
              </Circle>
              <Text>Connect your data directly</Text>
            </HStack>
            <HStack w={"100%"}>
              <Circle bg="purple.500">
                <Icon as={IoCheckmark} w={"75%"} />
              </Circle>
              <Text>Write your questions in natural language</Text>
            </HStack>
            <HStack w={"100%"}>
              <Circle bg="purple.500">
                <Icon as={IoCheckmark} w={"75%"} />
              </Circle>
              <Text>Query multiple data sources at once</Text>
            </HStack>
          </VStack>
        </Box>
      </SimpleGrid>
    </Flex>
  );
};
