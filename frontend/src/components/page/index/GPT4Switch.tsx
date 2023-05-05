import { HStack, Stack, Switch, Text, Tooltip } from "@chakra-ui/react";
import { FC } from "react";

export type GPT4SwitchProps = {
  isChecked: boolean;
  onToggle: () => void;
};

export const GPT4Switch: FC<GPT4SwitchProps> = ({ isChecked, onToggle }) => {
  return (
    <HStack align={"center"} direction={"row"} spacing={1}>
      <Tooltip
        label={
          <Stack>
            <Text>
              GPT-3.5 is typically sufficient, but if you are having trouble
              with the results, you can try GPT-4.
            </Text>
          </Stack>
        }
        aria-label="Disable fast mode for slower and potentially more accurate responses."
      >
        <Text
          fontSize={"sm"}
          whiteSpace={"nowrap"}
          textTransform={"uppercase"}
          color={isChecked ? "yellow.500" : "gray.400"}
          fontWeight={"bold"}
        >
          GPT4
        </Text>
      </Tooltip>
      <Switch isChecked={isChecked} onChange={onToggle} colorScheme="yellow" />
    </HStack>
  );
};
