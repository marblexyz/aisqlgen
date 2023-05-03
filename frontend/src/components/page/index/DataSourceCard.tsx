import { Box, Text, UseRadioProps, useRadio } from "@chakra-ui/react";
import { FC } from "react";

type DatasourceCardProps = UseRadioProps & {
  option: { value: string; label: string };
};

export const DatasourceCard: FC<DatasourceCardProps> = (props) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          bg: "blue.800",
          color: "white",
          borderColor: "blue.800",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={2}
        py={1}
      >
        <Text>{props.option.label}</Text>
      </Box>
    </Box>
  );
};
