import { useAppSelector } from "@/hooks/reduxHooks";
import { selectDatasourceMap } from "@/redux/slices/datasource/datasourceSliceSelectors";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
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
import { BasicButton } from "../common/BasicButton";
import { AddDatasourceModal } from "../datasource/AddDatasourceModal";

export const Sidebar: FC = () => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
  const datasourceMap = useAppSelector(selectDatasourceMap);
  const datasourceMapKeys = Object.keys(datasourceMap);
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
        <Flex w="100%" direction={"column"}>
          <Text
            fontSize="xs"
            fontWeight={"bold"}
            color="gray.400"
            pt={4}
            pb={2}
            textTransform={"uppercase"}
          >
            Connection list
          </Text>
          {datasourceMapKeys.map((key) => {
            const datasource = datasourceMap[key];
            return (
              <Button
                key={key}
                variant="unstyled"
                color={"gray.900"}
                _hover={{
                  bg: "gray.100",
                }}
                _active={{
                  bg: "gray.100",
                }}
                borderRadius={"1"}
                px={2}
              >
                <Flex w="100%" direction="column">
                  <Flex
                    justify={"space-between"}
                    w="100%"
                    fontSize={"sm"}
                    align={"center"}
                  >
                    <HStack>
                      <Image
                        src="/logos/postgres.png"
                        alt="Postgres Logo"
                        width={"15"}
                        height={"15"}
                      />
                      <Text fontWeight={"bold"}>
                        {datasource.config.resourceName}
                      </Text>
                    </HStack>

                    {/* <IconButton
                      alignItems={"center"}
                      variant={"unstyled"}
                      icon={<Icon as={IoEllipsisVertical} />}
                      aria-label={"More"}
                      h={4}
                    /> */}

                    <ChevronRightIcon h={4} />
                  </Flex>
                </Flex>
              </Button>
            );
          })}
        </Flex>
        <AddDatasourceModal
          isOpen={datasourceModalIsOpen}
          onClose={onCloseDatasourceModal}
        />
      </Flex>
    </Flex>
  );
};
