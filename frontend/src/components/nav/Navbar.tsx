import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { updateConfig } from "@/redux/slices/config/configSlice";
import { selectOpenAIKey } from "@/redux/slices/config/configSliceSelector";
import {
  Button,
  Flex,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { TimeoutText } from "../common/TimeoutText";
import { IoIosEyeOff, IoIosEye } from "react-icons/io";

export const Navbar: FC = () => {
  const openAIKey = useAppSelector(selectOpenAIKey);
  const dispatch = useAppDispatch();
  const [openAIKeyInput, setOpenAIKeyInput] = useState<string>(openAIKey);
  const [trigger, setTrigger] = useState<number>(0);
  const [show, setShow] = useBoolean();

  useEffect(() => {
    setOpenAIKeyInput(openAIKey);
  }, [openAIKey]);
  const handleClick = () => setShow.toggle();

  const handleSave = () => {
    setTrigger(trigger + 1);
    dispatch(
      updateConfig({
        openAIKey: openAIKeyInput,
      })
    );
  };
  return (
    <Flex
      as="nav"
      w="100%"
      h="12"
      justify={"space-between"}
      align={"center"}
      borderBottom={"1px solid"}
      borderColor={"gray.200"}
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
      <HStack mr={4} p={0} spacing={0}>
        <InputGroup w="460px">
          <Input
            pr={10}
            borderRadius={0}
            variant={"ghost"}
            placeholder="OpenAI API Key"
            type={show ? "text" : "password"}
            value={openAIKeyInput}
            onChange={(e) => setOpenAIKeyInput(e.target.value)}
            border="1px solid"
            borderColor="gray.100"
            _hover={{
              borderColor: "purple.300",
            }}
            _active={{
              borderColor: "purple.500",
            }}
            _focus={{
              borderColor: "purple.500",
            }}
          />
          <InputRightElement width="10" display="flex">
            <Button
              display="flex"
              size="sm"
              onClick={handleClick}
              variant="unstyled"
            >
              {show ? <IoIosEyeOff /> : <IoIosEye />}
            </Button>
          </InputRightElement>
        </InputGroup>
        <Button
          fontSize={"md"}
          w={24}
          borderRadius={0}
          bg={"purple.500"}
          color={"white"}
          _hover={{
            bg: "purple.100",
            cursor: "pointer",
          }}
          onClick={handleSave}
        >
          <TimeoutText
            color={"white"}
            baseText="Save"
            timeoutText="Saved"
            trigger={trigger}
          />
        </Button>
      </HStack>
    </Flex>
  );
};
