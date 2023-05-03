import { HStack, Stack, Switch, Text, Tooltip } from "@chakra-ui/react";
import { FC } from "react";

export type SampleDataSwitchProps = {
  isChecked: boolean;
  onToggle: () => void;
};

export const SampleDataSwitch: FC<SampleDataSwitchProps> = ({
  isChecked,
  onToggle,
}) => {
  return (
    <HStack align={"center"} direction={"row"} spacing={1}>
      <Tooltip
        label={
          <Stack>
            <Text>We recommend using sample data for better accuracy.</Text>
          </Stack>
        }
        aria-label="Disable fast mode for slower and potentially more accurate responses."
      >
        <Text
          fontSize={"sm"}
          whiteSpace={"nowrap"}
          textTransform={"uppercase"}
          color="yellow.500"
          fontWeight={"bold"}
        >
          Sample Data
        </Text>
      </Tooltip>
      <Switch isChecked={isChecked} onChange={onToggle} colorScheme="yellow" />
    </HStack>
  );
};
