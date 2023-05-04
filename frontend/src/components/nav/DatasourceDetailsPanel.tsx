import { Datasource } from "@/types/redux/slices/datasource";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import { IoEllipsisHorizontal } from "react-icons/io5";

export type DatasourceDetailsPanelProps = {
  datasource: Datasource;
  onReturnToList: () => void;
};

export const DatasourceDetailsPanel: FC<DatasourceDetailsPanelProps> = ({
  datasource,
  onReturnToList,
}) => {
  return (
    <Flex w="100%" py={2} direction={"column"}>
      <VStack w="100%" align={"left"} px={2}>
        <Button
          variant="unstyled"
          onClick={onReturnToList}
          w="min-content"
          h={6}
          px={1}
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
        <VStack w={"100%"} px={2}>
          <HStack w="100%" justify={"space-between"} h={4} align={"center"}>
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
            <Button
              aria-label="Edit datasource"
              variant="unstyled"
              px={0}
              py={0}
              h={6}
              w={"min-content"}
              _hover={{
                bg: "gray.100",
              }}
              borderRadius={1}
            >
              <Flex justify={"center"} w="100%" align={"center"}>
                <Icon w={4} h={4} as={IoEllipsisHorizontal} />
              </Flex>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Flex>
  );
};
