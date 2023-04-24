import { Navbar } from "@/components/navigation/Navbar";
import { IndexHeader } from "@/components/page/IndexHeader";
import { useGenerateSQLQuery } from "@/hooks/mutations/useGenerateSQLQuery";
import { useSamplePostgresData } from "@/hooks/queries/useSamplePostgresData";
import { getSchemaAsString } from "@/utils/getSchemaAsString";
import {
  Box,
  Button,
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
import { FC, useMemo, useState } from "react";

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
  value: DataSource;
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
  value,
  onChange,
}) => {
  const options: DataSourceType[] = [
    { value: DataSource.SAMPLE, label: "Sample Postgres" },
    { value: DataSource.POSTGRES, label: "PostgreSQL" },
    { value: DataSource.CUSTOM, label: "Custom schema" },
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "datasource",
    defaultValue: value,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        return <DatasourceCard key={option.value} option={option} {...radio} />;
      })}
    </HStack>
  );
};

export default function Home() {
  const [textareaHeight, setTextareaHeight] = useState(1);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>(
    DataSource.SAMPLE
  );
  const [userQuery, setUserQuery] = useState<string>("");

  const {
    data: dbSchema,
    isLoading: isLoadingDbSchema,
    isError: isErrorDbSchema,
  } = useSamplePostgresData({
    enabled: true,
  });

  const {
    data: generateSQLQueryResult,
    mutate: generateSQLQuery,
    isError: isErrorGenerateSQLQuery,
    isLoading: isLoadingGenerateSQLQuery,
  } = useGenerateSQLQuery();

  const schemaString = useMemo(() => {
    if (dbSchema === undefined) {
      return dbSchema;
    }
    const schemaString = getSchemaAsString(dbSchema);
    return schemaString;
  }, [dbSchema]);

  const showPreviewSchema = schemaString !== undefined && !isErrorDbSchema;

  const handleSelectDataSource = (value: DataSource) => {
    setSelectedDataSource(value);
  };
  const handleChangeUserQuery = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const height = event.target.scrollHeight;
    const rowHeight = 15;
    const trows = Math.ceil(height / rowHeight) - 1;
    if (trows !== textareaHeight) {
      setTextareaHeight(trows);
    }

    setUserQuery(event.target.value);
  };

  const generateUserQueryIsDisabled =
    userQuery === "" || isLoadingDbSchema || isErrorDbSchema;
  const handleGenerateQuery = () => {
    if (userQuery === "") {
      return;
    }
    generateSQLQuery({ query: userQuery, dbSchema });
  };

  return (
    <Box>
      <Navbar />
      <IndexHeader />
      <Flex
        w={"100%"}
        justify={"center"}
        align={"center"}
        px={4}
        pt={8}
        h="100%"
        overflowY={"auto"}
      >
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
            <DataSourceRadioGroup
              value={selectedDataSource}
              onChange={handleSelectDataSource}
            />
          </Box>
          <Heading size="sm" textAlign={"left"} w="100%">
            Preview schema
          </Heading>
          <Box w="100%" m={2}>
            {showPreviewSchema && (
              <Textarea
                placeholder="Here is a sample placeholder"
                resize={"vertical"}
                isDisabled={selectedDataSource !== DataSource.CUSTOM}
                value={schemaString}
              />
            )}
            {isLoadingDbSchema && <Text>Loading...</Text>}
            {isErrorDbSchema && <Text>Error loading schema</Text>}
          </Box>
          <Heading size="sm" textAlign={"left"} w="100%">
            Your question
          </Heading>
          <Box w="100%" m={2}>
            <Textarea
              placeholder="Here is a sample placeholder"
              resize={"vertical"}
              value={userQuery}
              onChange={handleChangeUserQuery}
            />
          </Box>
          <Button
            isDisabled={generateUserQueryIsDisabled}
            onClick={handleGenerateQuery}
          >
            Generate query
          </Button>
          <Heading size="sm" textAlign={"left"} w="100%">
            SQL Query
          </Heading>
          <Box w="100%" m={2}>
            <Textarea
              placeholder="Here is a sample placeholder"
              resize={"vertical"}
              value={generateSQLQueryResult}
              isDisabled={true}
              rows={textareaHeight}
            />
          </Box>
        </VStack>
      </Flex>
    </Box>
  );
}
