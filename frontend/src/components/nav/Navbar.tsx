import {
  Box,
  Flex,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC } from "react";
import { IoSettingsSharp } from "react-icons/io5";
import { OpenAIKeyModal } from "../common/OpenAIKeyModal";

export const Navbar: FC = () => {
  const {
    isOpen: isOpenOpenAIKeyModal,
    onClose: onCloseOpenAIKeyModal,
    onOpen: onOpenOpenAIKeyModal,
  } = useDisclosure();
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
            🤖 AISQLGen
          </Heading>
        </Flex>
      </Link>
      <Box mr={2}>
        <IconButton
          variant={"ghost"}
          aria-label="Settings"
          icon={<IoSettingsSharp />}
          onClick={onOpenOpenAIKeyModal}
        />
      </Box>
      <OpenAIKeyModal
        isOpen={isOpenOpenAIKeyModal}
        onClose={onCloseOpenAIKeyModal}
      />
    </Flex>
  );
};
