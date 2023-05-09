import { DatasourceMap } from "@/types/redux/slices/datasource";
import { Flex, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { FC } from "react";
import { IoAddSharp } from "react-icons/io5";
import { BasicButton } from "../common/BasicButton";
import { DatasourceListButton } from "./DatasourceListButton";

export type DatasourceListPanelProps = {
  datasourceMap: DatasourceMap;
  onClickDatasourceListItem: (id: string) => void;
  onClickUpdateLocal: () => void;
  onOpenDatasourceModal: () => void;
};

export const DatasourceListPanel: FC<DatasourceListPanelProps> = ({
  datasourceMap,
  onClickDatasourceListItem,
  onClickUpdateLocal,
  onOpenDatasourceModal,
}) => {
  const datasourceMapKeys = Object.keys(datasourceMap);
  return (
    <Flex w="100%" px={4} py={4} direction={"column"}>
      <VStack w="100%" align={"left"} mb={4}>
        <Heading size="sm" color="gray.900" mb="2">
          Data connections
        </Heading>
        <Text fontSize={"sm"} fontWeight={"regular"} color={"gray.700"}>
          Connections to external databases to be used when generating queries.
        </Text>
      </VStack>
      <VStack w="100%">
        <BasicButton
          w="100%"
          onClick={onOpenDatasourceModal}
          borderRadius={"sm"}
          bg={"purple.500"}
          color={"white"}
          _hover={{
            bg: "purple.100",
            cursor: "pointer",
          }}
          _active={{
            bg: "purple.100",
            cursor: "pointer",
          }}
          _focus={{
            bg: "purple.100",
            cursor: "pointer",
          }}
        >
          <HStack w="100%" align={"center"} justify={"center"}>
            <Icon as={IoAddSharp} />
            <Text>Add datasource</Text>
          </HStack>
        </BasicButton>
        <BasicButton w="100%" onClick={onClickUpdateLocal}>
          Sync local dataset
        </BasicButton>
      </VStack>

      <Flex w="100%" direction={"column"} flex={1}>
        <Text
          fontSize="xs"
          fontWeight={"bold"}
          color="gray.400"
          pt={4}
          pb={2}
          textTransform={"uppercase"}
        >
          Datasource list
        </Text>
        <Flex w="100%" direction={"column"} overflowY={"auto"} flex={1}>
          {datasourceMapKeys.map((key) => {
            const datasource = datasourceMap[key];
            if (datasource === undefined) {
              return undefined;
            }
            return (
              <DatasourceListButton
                key={key}
                id={key}
                datasource={datasource}
                onClick={onClickDatasourceListItem}
              />
            );
          })}
        </Flex>
      </Flex>
    </Flex>
  );
};
