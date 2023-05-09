import { Navbar } from "@/components/nav/Navbar";
import { IndexHeader } from "@/components/page/index/IndexHeader";
import { CHAKRA_100VH } from "@/style/constants";
import { Flex } from "@chakra-ui/react";

import type { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { getProviders } from "next-auth/react";
import { getAuthOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  return (
    <Flex direction={"column"} h={CHAKRA_100VH}>
      <Navbar />
      {/** subtract navbar height */}
      <Flex
        h="calc(100% - 48px)"
        direction={"column"}
        w="100%"
        overflowY="auto"
      >
        <IndexHeader />
      </Flex>
    </Flex>
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
