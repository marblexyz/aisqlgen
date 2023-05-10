import { BasicButton } from "@/components/common/BasicButton";
import { Navbar } from "@/components/nav/Navbar";
import { SEOHead } from "@/components/utility/SEOHead";
import { CHAKRA_100VH } from "@/style/constants";
import {
  Button,
  Link as ChakraLink,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import Link from "next/link";
import { FaDiscord } from "react-icons/fa";
import { getAuthOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return (
    <>
      <SEOHead title={"Generate SQL queries from natural language"} />
      <Flex direction={"column"} h={CHAKRA_100VH}>
        <Navbar />
        {/** subtract navbar height */}
        <Flex
          h="calc(100% - 48px)"
          direction={"column"}
          w="100%"
          overflowY="auto"
          justify={"center"}
          alignItems={"center"}
        >
          <VStack h={"100%"} w={"100%"} spacing={8} py={24} px={4}>
            <Heading color={"purple.500"}>
              Generate SQL queries using AI
            </Heading>
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
                <Heading size={"sm"}>{`Get started for free`}</Heading>
              </Link>
            </BasicButton>
            <Text>
              Need to generate queries locally?{" "}
              <ChakraLink
                target={"_blank"}
                href={"https://github.com/marblexyz/aisqlgen"}
                color={"purple.500"}
                _hover={{ textDecor: "underline" }}
              >
                Download on GitHub
              </ChakraLink>
            </Text>
            <video controls style={{ width: "100%", maxWidth: "1024px" }}>
              <source src="/demo-video.mp4" />
            </video>
          </VStack>
        </Flex>
        <Flex
          py={4}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          position="fixed"
          w="100%"
          bottom={0}
        >
          <HStack>
            <Button
              w="auto"
              display="flex"
              variant="unstyled"
              _hover={{
                bg: "purple.600",
              }}
            >
              <Link
                href={`https://discord.gg/5ZQ4mqMvpB`}
                target={"_blank"}
                style={{ display: "flex" }}
              >
                <HStack color="purple.900">
                  <Icon w={6} h={6} as={FaDiscord} />
                </HStack>
              </Link>
            </Button>
            <Text color="purple.900" fontWeight="bold" fontSize="sm">
              team@aisqlgen.com
            </Text>
          </HStack>
          <Text color="purple.900" fontSize="sm" fontWeight="bold">
            © Superdrop Labs Inc. {new Date().getFullYear()}{" "}
          </Text>
        </Flex>
      </Flex>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    getAuthOptions()
  );

  if (session !== null) {
    return { redirect: { destination: "/query" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
