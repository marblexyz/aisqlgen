import { Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { APIKeyInput } from "../common/APIKeyInput";

export const Navbar: FC = () => {
  return (
    <Flex
      as="nav"
      w="100%"
      h="12"
      justify={"space-between"}
      align={"center"}
      borderBottom={"1px solid"}
      borderColor={"gray.200"}
      position="sticky"
      top="0"
    >
      <Link href={"/"}>
        <Flex
          h="12"
          _hover={{ bg: "purple.50" }}
          px={4}
          alignItems={"center"}
          borderRight="1px solid"
          borderColor={"gray.200"}
        >
          <Heading size={"md"} color="purple.600" textAlign={"center"}>
            🤖 SQLGen
          </Heading>
        </Flex>
      </Link>
      <APIKeyInput />
    </Flex>
  );
};
