import { useGetPostgresSchema } from "@/hooks/queries/useGetPostgresSchema";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { deleteDatasource } from "@/redux/slices/datasource/datasourceSlice";
import { CHAKRA_100VH } from "@/style/constants";
import { Datasource, DatasourceType } from "@/types/redux/slices/datasource";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import { SchemaSidebar } from "../common/SchemaSidebar";
import { DatasourceInputModal } from "../datasource/DatasourceInputModal";

export type DatasourceDetailsPanelProps = {
  datasourceId: string;
  datasource: Datasource;
  onReturnToList: () => void;
};

export const DatasourceDetailsPanel: FC<DatasourceDetailsPanelProps> = ({
  datasourceId,
  datasource,
  onReturnToList,
}) => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
  const { data, isLoading, isError } = useGetPostgresSchema({
    datasource,
    enabled: datasource.type === DatasourceType.Postgres,
  });
  const dispatch = useAppDispatch();
  const handleDatasourceDelete = () => {
    dispatch(deleteDatasource(datasourceId));
    onReturnToList();
  };
  return (
    <>
      <Flex w="xs" direction={"column"} maxH={CHAKRA_100VH} h="100%">
        <VStack
          w="100%"
          align={"left"}
          px={2}
          py={2}
          position="sticky"
          top="0"
          overflow="auto"
        >
          <Box px={1}>
            <Button
              variant="unstyled"
              onClick={onReturnToList}
              w="100%"
              h={6}
              borderRadius={1}
              _hover={{
                bg: "gray.100",
              }}
            >
              <HStack w="100%" alignItems={"center"} spacing={0}>
                <ChevronLeftIcon px={0} color="gray.400" h={4} />
                <Text
                  fontSize="xs"
                  fontWeight={"bold"}
                  color="gray.400"
                  textTransform={"uppercase"}
                >
                  Datasource list
                </Text>
              </HStack>
            </Button>
          </Box>
          <VStack w={"100%"} px={1}>
            <HStack w="100%" justify={"space-between"} h={4} align={"center"}>
              <Button
                px={1}
                w={"100%"}
                onClick={onOpenDatasourceModal}
                variant="unstyled"
                display="flex"
                justifyContent="flex-start"
                borderRadius={1}
                _hover={{
                  bg: "gray.100",
                }}
              >
                <HStack>
                  <Image
                    src={`/logos/${datasource.type.toLowerCase()}.png`}
                    alt={`${datasource.type} Logo}`}
                    width={"15"}
                    height={"15"}
                  />
                  <Heading size="sm" color="gray.900">
                    {datasource.config.resourceName}
                  </Heading>
                </HStack>
              </Button>
              <Button
                aria-label="Edit datasource"
                variant="unstyled"
                textTransform={"uppercase"}
                fontWeight={"bold"}
                color={"red.500"}
                fontSize={"xs"}
                borderColor={"red.500"}
                _hover={{
                  bg: "red.50",
                }}
                display="flex"
                px={2}
                py={0}
                borderRadius={1}
                onClick={handleDatasourceDelete}
              >
                Delete
              </Button>
            </HStack>
          </VStack>
          <Flex h="100%" justifyContent={"center"} alignItems={"center"}>
            {isLoading && <Text>Loading...</Text>}
            {isError && <Text>Error loading schema</Text>}
          </Flex>
          {data?.schema !== undefined && <SchemaSidebar schema={data.schema} />}
        </VStack>
      </Flex>
      {datasourceModalIsOpen && (
        <DatasourceInputModal
          isOpen={datasourceModalIsOpen}
          onClose={onCloseDatasourceModal}
          initialValues={{
            ...datasource.config,
            port: datasource.config.port.toString(),
            id: datasourceId,
          }}
        />
      )}
    </>
  );
};
