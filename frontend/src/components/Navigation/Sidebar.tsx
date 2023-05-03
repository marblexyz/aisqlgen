import { Flex, Heading, Text, VStack, useDisclosure } from "@chakra-ui/react";
import { FC } from "react";
import { BasicButton } from "../common/BasicButton";
import { AddDatasourceModal } from "../datasource/AddDatasourceModal";

export const Sidebar: FC = () => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
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
        <BasicButton onClick={onOpenDatasourceModal}>
          <Text>Add connection</Text>
        </BasicButton>
        <AddDatasourceModal
          isOpen={datasourceModalIsOpen}
          onClose={onCloseDatasourceModal}
        />
      </Flex>
    </Flex>
  );
};
