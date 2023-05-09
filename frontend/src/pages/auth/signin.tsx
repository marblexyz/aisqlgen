import { GoogleLoginButton } from "@/components/login/GoogleLoginButton";
import { CHAKRA_100VH } from "@/style/constants";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";

import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";
import { getAuthOptions } from "../api/auth/[...nextauth]";

export default function SignIn() {
  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/query" });
  };
  return (
    <Flex
      direction={"column"}
      h={CHAKRA_100VH}
      justify={"center"}
      align={"center"}
      bg="gray.100"
    >
      <Box
        border={"1px solid"}
        borderColor="gray.200"
        bg={"white"}
        borderRadius={2}
        textAlign={"left"}
        w={"container.sm"}
        py={12}
        px={8}
      >
        <VStack w="100%" align={"left"} spacing={8}>
          <Flex h="12" alignItems={"center"}>
            <Heading size={"md"} color="purple.600" textAlign={"center"}>
              🤖 AISQLGen
            </Heading>
          </Flex>
          <VStack w="100%" align="left" spacing={6}>
            <Heading size="md" color="gray.900">
              Welcome to the AI SQL generator!
            </Heading>
            <GoogleLoginButton onClick={handleGoogleSignIn} />
          </VStack>
        </VStack>
      </Box>
    </Flex>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(
    context.req,
    context.res,
    getAuthOptions()
  );

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session !== null) {
    return { redirect: { destination: "/query" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
