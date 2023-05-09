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
            <Text>
              Using sample data helps with accuracy but will spend much more
              OpenAI credit.
            </Text>
            <Text>
              We sample 3 rows from the table to infer better the structure of
              the data when generating the query.
            </Text>
          </Stack>
        }
        aria-label="Disable fast mode for slower and potentially more accurate responses."
      >
        <Text
          fontSize={"xs"}
          whiteSpace={"nowrap"}
          textTransform={"uppercase"}
          color={isChecked ? "yellow.500" : "gray.400"}
          fontWeight={"bold"}
        >
          Sample Data
        </Text>
      </Tooltip>
      <Switch isChecked={isChecked} onChange={onToggle} colorScheme="yellow" />
    </HStack>
  );
};
