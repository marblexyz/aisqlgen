import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { updateConfig } from "@/redux/slices/config/configSlice";
import { selectOpenAIKey } from "@/redux/slices/config/configSliceSelector";
import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  useBoolean,
} from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { TimeoutText } from "../common/TimeoutText";
import { localForageStore } from "@/storage/storage-provider";
import { SHOW_OPEN_AI_KEY_MODAL } from "@/storage/keys";
import { BasicButton } from "./BasicButton";

type APIKeyInputProps = {
  onSave?: () => void;
};

export const APIKeyInput: FC<APIKeyInputProps> = ({ onSave }) => {
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
    onSave?.();
    void localForageStore.setItem(SHOW_OPEN_AI_KEY_MODAL, false);
  };
  return (
    <HStack mr={4} p={0} spacing={0}>
      <InputGroup w="460px">
        <Input
          pr={10}
          h={8}
          borderRadius={"sm"}
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
      <BasicButton
        bg={"purple.500"}
        color={"white"}
        _hover={{
          bg: "purple.100",
          cursor: "pointer",
        }}
        _active={{
          bg: "purple.100",
          cursor: "pointer",
        }}
        _focus={{
          bg: "purple.100",
          cursor: "pointer",
        }}
        _disabled={{
          bg: "purple.100",
        }}
        onClick={handleSave}
      >
        <TimeoutText
          color={"white"}
          baseText="Load OpenAI Key"
          timeoutText="Saved"
          trigger={trigger}
        />
      </BasicButton>
    </HStack>
  );
};
