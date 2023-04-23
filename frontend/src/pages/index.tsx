import { Navbar } from "@/components/navigation/Navbar";
import { IndexHeader } from "@/components/page/IndexHeader";
import { useSamplePostgresData } from "@/hooks/queries/useSamplePostgresData";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Heading,
  Text,
  Textarea,
  UseRadioProps,
  VStack,
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import { FC, useState } from "react";

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

export type DataSourceRadioGroupProps = {
  onChange: (value: DataSource) => void;
};

export enum DataSource {
  POSTGRES = "postgres",
  SAMPLE = "sample",
  CUSTOM = "custom",
}

export type DataSourceType = {
  value: DataSource;
  label: string;
};

export const DataSourceRadioGroup: FC<DataSourceRadioGroupProps> = ({
  onChange,
}) => {
  const options: DataSourceType[] = [
    { value: DataSource.SAMPLE, label: "Sample Postgres" },
    { value: DataSource.POSTGRES, label: "PostgreSQL" },
    { value: DataSource.CUSTOM, label: "Custom schema" },
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "datasource",
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value: value.value });
        return <DatasourceCard key={value.value} option={value} {...radio} />;
      })}
    </HStack>
  );
};

export default function Home() {
  const [state, setState] = useState<DataSource | undefined>(undefined);

  const { schemaString, isLoading, isError } = useSamplePostgresData({
    enabled: true,
  });

  const showPreviewSchema = schemaString !== undefined && !isError;

  const handleSelectDataSource = (value: DataSource) => {
    setState(value);
  };
  return (
    <Box>
      <Navbar />
      <IndexHeader />
      <Flex w={"100%"} justify={"center"} align={"center"} px={4} pt={8}>
        <VStack w="container.lg" spacing={4}>
          <Heading size="md" textAlign={"left"} w="100%">
            Generate query
          </Heading>
          <Text w="100%">
            Select a data source, a schema, a table, and a question to generate
            your query.
          </Text>
          <Divider />
          <Heading size="sm" textAlign={"left"} w="100%">
            Data source
          </Heading>
          <Box w="100%" m={2}>
            <DataSourceRadioGroup onChange={handleSelectDataSource} />
          </Box>
          <Heading size="sm" textAlign={"left"} w="100%">
            Preview schema
          </Heading>
          <Box w="100%" m={2}>
            {showPreviewSchema && (
              <Textarea
                placeholder="Here is a sample placeholder"
                size="sm"
                resize={"vertical"}
                isDisabled={state !== DataSource.CUSTOM}
                value={schemaString}
              />
            )}
            {isLoading && <Text>Loading...</Text>}
            {isError && <Text>Error loading schema</Text>}
          </Box>
        </VStack>
      </Flex>
      {/* Resource Selector */}

      {/* Schema */}
      {/* Question */}
      {/* Output */}
    </Box>
  );
}
