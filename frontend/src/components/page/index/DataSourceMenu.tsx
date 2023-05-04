import { AddDatasourceModal } from "@/components/datasource/AddDatasourceModal";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectDatasourceMap } from "@/redux/slices/datasource/datasourceSliceSelectors";
import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
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
  const dataSourceMap = useAppSelector(selectDatasourceMap);
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
  const handleClick = (value: string) => {
    onChange(value);
  };
  const selectedDataSourceConfig =
    value !== undefined
      ? dataSourceMap[value].config
      : { resourceName: "Select a data source" };

  return (
    <>
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
            <Text>{selectedDataSourceConfig.resourceName}</Text>
          </HStack>
        </MenuButton>
        <MenuList py={0}>
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
          <VStack w="100%" spacing="0">
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
                  fontWeight: "bold",
                }}
              >
                {dataSource.config.resourceName}
              </MenuItem>
            ))}
          </VStack>
        </MenuList>
      </Menu>
      <AddDatasourceModal
        isOpen={datasourceModalIsOpen}
        onClose={onCloseDatasourceModal}
      />
    </>
  );
};
