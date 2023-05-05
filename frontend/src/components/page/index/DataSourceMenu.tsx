import { DatasourceInputModal } from "@/components/datasource/DatasourceInputModal";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectDatasourceMap } from "@/redux/slices/datasource/datasourceSliceSelectors";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";
import { BsDatabase } from "react-icons/bs";

export type DataSourceMenuProps = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export const DataSourceMenu: FC<DataSourceMenuProps> = ({
  value,
  onChange,
}) => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
  const handleClick = (value: string) => {
    onChange(value);
  };
  const dataSourceMap = useAppSelector(selectDatasourceMap);
  const selectedDataSourceConfig =
    value !== undefined
      ? dataSourceMap[value]?.config
      : { resourceName: "Select a data source" };
  const resourceName =
    selectedDataSourceConfig?.resourceName !== undefined
      ? selectedDataSourceConfig.resourceName
      : "Select a data source";

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          h={8}
          w={48}
          borderRadius={"sm"}
          textTransform={"uppercase"}
          fontWeight={"bold"}
          color={"purple.500"}
          fontSize={"xs"}
          variant="outline"
          borderColor={"purple.500"}
        >
          <HStack w="100%" justifyContent={"center"}>
            <BsDatabase />
            <Text>{resourceName}</Text>
          </HStack>
        </MenuButton>
        <MenuList>
          <Box w="100%" py={2} px={2}>
            <Text
              fontSize="xs"
              fontWeight={"bold"}
              color="gray.400"
              pb={2}
              textTransform={"uppercase"}
            >
              Data source
            </Text>
            <Button
              h={8}
              w="100%"
              display="flex"
              borderRadius={"sm"}
              textTransform={"uppercase"}
              fontWeight={"bold"}
              color={"purple.500"}
              fontSize={"xs"}
              variant="outline"
              borderColor={"purple.500"}
              leftIcon={<AddIcon />}
              onClick={onOpenDatasourceModal}
            >
              Add connection
            </Button>
          </Box>
          <Flex w="100%" direction="column">
            {Object.entries(dataSourceMap).map(([id, dataSource]) => (
              <MenuItem
                display="flex"
                borderRadius={"sm"}
                justifyContent={"flex-start"}
                key={id}
                onClick={() => {
                  handleClick(id);
                }}
                as={Button}
                fontWeight={id === value ? "bold" : "normal"}
                color={id === value ? "purple.500" : "gray.600"}
                bgColor={id === value ? "purple.50" : "transparent"}
                _hover={{
                  bgColor: id === value ? "purple.50" : "gray.50",
                }}
              >
                {dataSource?.config.resourceName}
              </MenuItem>
            ))}
          </Flex>
        </MenuList>
      </Menu>
      {datasourceModalIsOpen && (
        <DatasourceInputModal
          isOpen={datasourceModalIsOpen}
          onClose={onCloseDatasourceModal}
        />
      )}
    </Box>
  );
};
