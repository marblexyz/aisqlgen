import { HStack, Stack, Switch, Text, Tooltip } from "@chakra-ui/react";
import { FC } from "react";

export type FastModeSwitchProps = {
  isChecked: boolean;
  onToggle: () => void;
};

export const FastModeSwitch: FC<FastModeSwitchProps> = ({
  isChecked,
  onToggle,
}) => {
  return (
    <HStack align={"center"} direction={"row"} spacing={1}>
      <Tooltip
        label={
          <Stack>
            <Text>
              We recommend using fast mode for faster responses. In fast mode,
              the AI first determines what tables to use, and then generates a
              query based on that information.
            </Text>
            <Text>
              In slow mode, the AI uses the entire database schema, including
              examples, to generate a query. This takes longer, but may be more
              accurate.
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
          Fast mode
        </Text>
      </Tooltip>
      <Switch isChecked={isChecked} onChange={onToggle} colorScheme="yellow" />
    </HStack>
  );
};
