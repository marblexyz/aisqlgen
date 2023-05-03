import { QueryPanel } from "@/components/common/QueryPanel";
import { Navbar } from "@/components/nav/Navbar";
import { Sidebar } from "@/components/nav/Sidebar";
import { IndexHeader } from "@/components/page/index/IndexHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { createQuery } from "@/redux/slices/query/querySlice";
import { selectIds } from "@/redux/slices/query/querySliceSelectors";
import { CHAKRA_100VH } from "@/style/constants";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Home() {
  const dispatch = useAppDispatch();
  const handleCreateNewQuery = () => {
    dispatch(createQuery());
  };
  const ids = useAppSelector(selectIds);

  return (
    <Flex direction={"column"} h={CHAKRA_100VH}>
      <Navbar />
      <Flex h="100%">
        <Sidebar />
        <Flex direction={"column"} w="100%">
          <IndexHeader />
          <Flex w={"100%"} justify={"center"} align={"center"} px={4} pt={8}>
            <VStack w="container.lg" spacing={4}>
              <Heading size="md" textAlign={"left"} w="100%">
                Generate query
              </Heading>
              <HStack w="100%">
                <Text w="100%">
                  Select a data source, a schema, a table, and a question to
                  generate your query.
                </Text>
                <Button
                  p={0}
                  my={0}
                  h={8}
                  w={48}
                  borderRadius={0}
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                  color={"purple.500"}
                  fontSize={"xs"}
                  variant="outline"
                  borderColor={"purple.500"}
                  onClick={handleCreateNewQuery}
                >
                  Create new query
                </Button>
              </HStack>
              <Divider />
              {ids.map((id) => (
                <QueryPanel key={id} id={id} />
              ))}
            </VStack>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
