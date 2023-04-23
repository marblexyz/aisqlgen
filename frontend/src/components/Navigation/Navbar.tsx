import { Box, Flex, HStack, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

export const Navbar: FC = () => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  const links = [
    {
      name: "Query",
      path: "/query",
    },
    {
      name: "Resources",
      path: "/resources",
    },
  ];

  return (
    <Flex
      as="nav"
      w="100%"
      h="4rem"
      bg="gray.900"
      justify={"center"}
      px={4}
      align={"center"}
    >
      <Box w={"100%"} maxW={"container.lg"}>
        <HStack spacing={8}>
          <Link href={"/"}>
            <Heading size={"sm"} color="gray.300">
              🤖 QueryMaker
            </Heading>
          </Link>
          <HStack spacing={4}>
            {links.map((link, ix) => (
              <Link key={ix} href={link.path}>
                <Text
                  size={"sm"}
                  color="gray.300"
                  bg={isActive(link.path) ? "gray.700" : "none"}
                  px={1}
                  borderRadius={"md"}
                  _hover={{
                    bg: "gray.700",
                  }}
                >
                  {link.name}
                </Text>
              </Link>
            ))}
          </HStack>
        </HStack>
      </Box>
    </Flex>
  );
};
