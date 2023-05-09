import { Navbar } from "@/components/nav/Navbar";
import { IndexHeader } from "@/components/page/index/IndexHeader";
import { CHAKRA_100VH } from "@/style/constants";
import { Flex } from "@chakra-ui/react";

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
