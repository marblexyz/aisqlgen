import { HStack, Switch, Text } from "@chakra-ui/react";
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
      <Text fontSize={"md"}>Use sample data to generate queries</Text>
      <Switch isChecked={isChecked} onChange={onToggle} colorScheme="purple" />
    </HStack>
  );
};
