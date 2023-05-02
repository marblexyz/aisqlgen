import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { BasicButton } from "../common/BasicButton";

export const Sidebar: FC = () => {
  return (
    <Flex h="100%" borderRight="1px solid" borderColor="gray.100" minW="3xs">
      <Flex w="100%" px={4} py={4} direction={"column"}>
        <VStack w="100%" align={"left"} mb={4}>
          <Heading size="sm" color="gray.900" mb="2">
            Data connections
          </Heading>
          <Text fontSize={"sm"} fontWeight={"regular"} color={"gray.700"}>
            Connections to external databases to be used when generating
            queries.
          </Text>
        </VStack>
        <BasicButton>
          <Text>Add connection</Text>
        </BasicButton>
      </Flex>
    </Flex>
  );
};
