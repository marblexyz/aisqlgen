import { Button, Flex, Heading, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import { SettingsModal } from "../common/SettingsModal";

export const Navbar: FC = () => {
  const {
    isOpen: isOpenOpenAIKeyModal,
    onClose: onCloseOpenAIKeyModal,
    onOpen: onOpenOpenAIKeyModal,
  } = useDisclosure();
  const { data: session } = useSession();
  const isLoggedIn = session !== null;
  return (
    <>
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
              🤖 AI SQL Generator
            </Heading>
          </Flex>
        </Link>
        {isLoggedIn && (
          <Button
            variant="unstyled"
            onClick={onOpenOpenAIKeyModal}
            h="12"
            _hover={{ bg: "purple.50" }}
            px={4}
            alignItems={"center"}
            borderLeft="1px solid"
            borderColor={"gray.200"}
            borderRadius={0}
          >
            <Heading size={"sm"} color="purple.600" textAlign={"center"}>
              Settings
            </Heading>
          </Button>
        )}
        {!isLoggedIn && (
          <Link href={"/auth/signin"}>
            <Button
              variant="unstyled"
              h="12"
              _hover={{ bg: "purple.50" }}
              px={4}
              alignItems={"center"}
              borderLeft="1px solid"
              borderColor={"gray.200"}
              borderRadius={0}
            >
              <Heading size={"sm"} color="purple.600" textAlign={"center"}>
                Sign in
              </Heading>
            </Button>
          </Link>
        )}
      </Flex>
      <SettingsModal
        isOpen={isOpenOpenAIKeyModal}
        onClose={onCloseOpenAIKeyModal}
      />
    </>
  );
};
