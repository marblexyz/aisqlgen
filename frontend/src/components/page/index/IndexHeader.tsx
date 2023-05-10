import { BasicButton } from "@/components/common/BasicButton";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
export const IndexHeader = () => {
  return (
    <Flex
      w={"100%"}
      bg={"gray.50"}
      align={"center"}
      justify={"center"}
      py={6}
      minH="60"
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
        <BasicButton bg={"purple.500"} color={"white"}>
          <Link href={"/auth/signin"}>
            <Heading size={"md"}>Get started for free</Heading>
          </Link>
        </BasicButton>

        <Box borderRadius={2}>
          <Image
            width={700}
            height={200}
            src={"/generate_query.png"}
            alt={"Picture of a robot writing SQL on a blackboard."}
          />
        </Box>
      </VStack>

      {/* <Box
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
        </Box> */}
    </Flex>
  );
};
