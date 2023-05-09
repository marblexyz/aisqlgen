import { InputProps as ChakraInputProps, Input } from "@chakra-ui/react";
import { FC } from "react";

export type BasicInputProps = ChakraInputProps;
export const BasicInput: FC<BasicInputProps> = ({ ...rest }) => {
  return (
    <Input
      borderRadius={"sm"}
      border="1px solid"
      borderColor={"gray.200"}
      _hover={{
        borderColor: "gray.300",
        boxShadow: "sm",
      }}
      _focus={{
        borderColor: "gray.300",
        boxShadow: "sm",
      }}
      _active={{
        borderColor: "gray.300",
        boxShadow: "sm",
      }}
      {...rest}
    />
  );
};
