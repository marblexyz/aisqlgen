import { OpenAIKeyModal } from "@/components/common/OpenAIKeyModal";
import { QueryPanel } from "@/components/common/QueryPanel";
import { Navbar } from "@/components/nav/Navbar";
import { Sidebar } from "@/components/nav/Sidebar";
import { IndexHeader } from "@/components/page/index/IndexHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectOpenAIKey } from "@/redux/slices/config/configSliceSelector";
import { createQuery } from "@/redux/slices/query/querySlice";
import { selectIds } from "@/redux/slices/query/querySliceSelectors";
import { SHOW_OPEN_AI_KEY_MODAL } from "@/storage/keys";
import { localForageStore } from "@/storage/storage-provider";
import { CHAKRA_100VH } from "@/style/constants";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Home() {
  const {
    isOpen: isOpenOpenAIKeyModal,
    onClose: onCloseOpenAIKeyModal,
    onOpen: onOpenOpenAIKeyModal,
  } = useDisclosure();
  const openAIKey = useAppSelector(selectOpenAIKey);
  useEffect(() => {
    const showModal = async () => {
      if (
        openAIKey === "" &&
        ((await localForageStore.getItem(SHOW_OPEN_AI_KEY_MODAL)) === null ||
          (await localForageStore.getItem(SHOW_OPEN_AI_KEY_MODAL)) === true)
      ) {
        onOpenOpenAIKeyModal();
      }
    };
    void showModal();
  }, [openAIKey, onOpenOpenAIKeyModal]);

  const dispatch = useAppDispatch();
  const handleCreateNewQuery = () => {
    dispatch(createQuery());
  };
  const ids = useAppSelector(selectIds);
  const [isMounted, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return (
    <Flex direction={"column"} h={CHAKRA_100VH}>
      <Navbar />
      {/** subtract navbar height */}
      <Flex h="calc(100% - 48px)">
        <Sidebar />
        <Flex direction={"column"} w="100%" overflowY="auto" pb={24}>
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
              {isMounted && ids.map((id) => <QueryPanel key={id} id={id} />)}
            </VStack>
          </Flex>
        </Flex>
      </Flex>
      <OpenAIKeyModal
        isOpen={isOpenOpenAIKeyModal}
        onClose={onCloseOpenAIKeyModal}
      />
    </Flex>
  );
}
