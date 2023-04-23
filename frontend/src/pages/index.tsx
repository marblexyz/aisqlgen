import { Navbar } from "@/components/Navigation/Navbar";
import {
  Box,
  Button,
  Circle,
  Flex,
  HStack,
  Heading,
  Icon,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { IoBook, IoCheckmark } from "react-icons/io5";

export default function Home() {
  return (
    <Box>
      <Navbar />
      <Flex
        w={"100%"}
        bg={"gray.700"}
        align={"center"}
        justify={"center"}
        pt={24}
        pb={16}
      >
        <HStack
          h={"100%"}
          w={"100%"}
          flex={1}
          maxW={"container.lg"}
          spacing={"6"}
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
          <VStack
            bg={"gray.900"}
            p={6}
            borderRadius={4}
            color="gray.100"
            w={"90%"}
            h={"100%"}
            fontSize={"sm"}
            spacing={2}
            textAlign={"left"}
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
        </HStack>
      </Flex>
      <Flex w={"100%"} align={"center"} justify={"center"} py={16}>
        <VStack align={"center"} justify={"center"} spacing={8}>
          <Heading size={"md"}>Connect your data to get started</Heading>
          <HStack w={"100%"}>
            <Link href="/resources/new/postgresql">
              <Button
                variant={"unstyled"}
                h={24}
                w={"md"}
                border={"2px solid"}
                borderColor={"blue.300"}
                bg={"blue.50"}
                alignItems={"center"}
                justifyContent={"center"}
                _hover={{ bg: "blue.100" }}
              >
                <VStack>
                  <Image
                    src={"/logos/postgres.png"}
                    width={24}
                    height={24}
                    alt={"Postgres logo"}
                  />
                  <Text color={"blue.800"}>Connect your Postgres database</Text>
                </VStack>
              </Button>
            </Link>
            <Button
              variant={"unstyled"}
              h={24}
              w={"md"}
              border={"2px solid"}
              borderColor={"gray.300"}
              bg={"gray.100"}
              _hover={{ bg: "gray.200" }}
            >
              <Icon as={IoBook} w={8} h={8} color={"gray.400"} />
              <Text color={"gray.800"}>Use sample data</Text>
            </Button>
          </HStack>
        </VStack>
      </Flex>
      {/* Form to add postgres DB */}
      {/* Sample database */}
    </Box>
  );
}
