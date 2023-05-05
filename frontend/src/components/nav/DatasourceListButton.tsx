import { Datasource } from "@/types/redux/slices/datasource";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";

export type DatasourceListButtonProps = {
  id: string;
  datasource: Datasource;
  onClick: (id: string) => void;
};

export const DatasourceListButton: FC<DatasourceListButtonProps> = ({
  id,
  datasource,
  onClick,
}) => {
  const { resourceName } = datasource.config;
  return (
    <Button
      w="100%"
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
      onClick={() => onClick(id)}
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
              src={`/logos/${datasource.type.toLowerCase()}.png`}
              alt={`${datasource.type} Logo}`}
              width={"15"}
              height={"15"}
            />
            <Text fontWeight={"bold"}>{resourceName}</Text>
          </HStack>
          <ChevronRightIcon h={4} />
        </Flex>
      </Flex>
    </Button>
  );
};
