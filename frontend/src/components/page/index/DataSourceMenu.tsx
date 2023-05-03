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
} from "@chakra-ui/react";
import { FC } from "react";
import { BsDatabase } from "react-icons/bs";
export type DataSourceMenuProps = {
  value: DataSource;
  onChange: (value: DataSource) => void;
};

export enum DataSource {
  POSTGRES = "postgres",
  SAMPLE = "sample",
  CUSTOM = "custom",
}

export type DataSourceType = {
  value: DataSource;
  label: string;
};

const options: DataSourceType[] = [
  { value: DataSource.SAMPLE, label: "Sample Postgres" },
  { value: DataSource.POSTGRES, label: "PostgreSQL" },
  { value: DataSource.CUSTOM, label: "Custom schema" },
];

export const DataSourceMenu: FC<DataSourceMenuProps> = ({
  value,
  onChange,
}) => {
  const handleClick = (value: DataSource) => {
    onChange(value);
  };
  return (
    <Menu>
      <MenuButton
        as={Button}
        h={8}
        w={32}
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
          <Text>{value}</Text>
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
        </Box>
        <VStack w="100%" spacing="0">
          {options.map((option) => (
            <MenuItem
              display="flex"
              borderRadius={"sm"}
              justifyContent={"flex-start"}
              key={option.value}
              onClick={() => {
                handleClick(option.value);
              }}
              as={Button}
              fontWeight={option.value === value ? "bold" : "normal"}
              color={option.value === value ? "purple.500" : "gray.600"}
              bgColor={option.value === value ? "purple.50" : "transparent"}
              _hover={{
                bgColor: option.value === value ? "purple.50" : "gray.50",
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </VStack>
      </MenuList>
    </Menu>
  );
};
