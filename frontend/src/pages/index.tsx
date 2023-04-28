import { AutoResizeTextarea } from "@/components/common/AutoResizeTextarea";
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
  Spinner,
  Stack,
  Switch,
  Text,
  Textarea,
  Tooltip,
  UseRadioProps,
  VStack,
  useBoolean,
  useClipboard,
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
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>(
    DataSource.SAMPLE
  );
  const [fastMode, setFastMode] = useBoolean(true);

  const [userQuery, setUserQuery] = useState<string>("");

  const {
    data: samplePostgresData,
    isLoading: isLoadingDbSchema,
    isError: isErrorDbSchema,
  } = useSamplePostgresData(3);

  const onSuccessGenerateQuery = (result: string | undefined) => {
    if (result === undefined) {
      return;
    }
    setValue(result);
  };

  const {
    data: generateSQLQueryResult,
    mutate: generateSQLQuery,
    isError: isErrorGenerateSQLQuery,
    isLoading: isLoadingGenerateSQLQuery,
  } = useGenerateSQLQuery(onSuccessGenerateQuery);

  const schemaString = useMemo(() => {
    if (samplePostgresData?.schema === undefined) {
      return undefined;
    }
    const schemaString = getSchemaAsString(
      samplePostgresData.schema,
      undefined,
      samplePostgresData.sampleRows
    );
    return schemaString;
  }, [samplePostgresData]);

  const showPreviewSchema = schemaString !== undefined && !isErrorDbSchema;

  const handleSelectDataSource = (value: DataSource) => {
    setSelectedDataSource(value);
  };
  const handleChangeUserQuery = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserQuery(event.target.value);
  };

  const generateUserQueryIsDisabled =
    userQuery === "" || isLoadingDbSchema || isErrorDbSchema;
  const handleGenerateQuery = () => {
    if (userQuery === "") {
      return;
    }
    if (samplePostgresData?.schema === undefined) {
      return;
    }
    generateSQLQuery({
      query: userQuery,
      dbSchema: samplePostgresData.schema,
      sampleRows: samplePostgresData.sampleRows,
      sequential: fastMode,
    });
  };

  return (
    <>
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
          <VStack
            w="100%"
            border={"1px solid"}
            borderColor={"gray.100"}
            boxShadow={"xs"}
            borderRadius={"sm"}
            spacing={0}
            _focusWithin={{ border: "1px solid", borderColor: "purple.300" }}
          >
            <Flex
              w="100%"
              bg={"purple.50"}
              h="auto"
              minH={10}
              direction={"row"}
              align={"center"}
              maxH={16}
              justifyContent={"space-between"}
            >
              <Text
                textTransform={"uppercase"}
                mx={2}
                fontWeight={"bold"}
                color={"purple.500"}
                fontSize={"xs"}
                whiteSpace={"nowrap"}
              >
                Your query
              </Text>
              <Flex w="100%">
                <AutoResizeTextarea
                  borderRadius={"none"}
                  maxH={16}
                  value={userQuery}
                  border={"none"}
                  _focusVisible={{
                    border: "none",
                  }}
                  py={1}
                  placeholder="What query do you want to generate? E.g. List all orders from last week."
                  w="100%"
                  px={0}
                  onChange={handleChangeUserQuery}
                />
              </Flex>
              <HStack mx={1}>
                <HStack align={"center"} direction={"row"} spacing={1}>
                  <Tooltip
                    label={
                      <Stack>
                        <Text>
                          We recommend using fast mode for faster responses. In
                          fast mode, the AI first determines what tables to use,
                          and then generates a query based on that information.
                        </Text>
                        <Text>
                          In slow mode, the AI uses the entire database schema,
                          including examples, to generate a query. This takes
                          longer, but may be more accurate.
                        </Text>
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
                      Fast mode
                    </Text>
                  </Tooltip>
                  <Switch
                    isChecked={fastMode}
                    onChange={setFastMode.toggle}
                    colorScheme="yellow"
                  />
                </HStack>
                <Button
                  fontSize={"md"}
                  p={0}
                  my={0}
                  onClick={handleGenerateQuery}
                  h={8}
                  w={32}
                  borderRadius={"sm"}
                  bg={"purple.500"}
                  color={"white"}
                  _hover={{
                    bg: "purple.100",
                    cursor: "pointer",
                  }}
                  isLoading={isLoadingGenerateSQLQuery}
                  isDisabled={generateUserQueryIsDisabled}
                  spinner={<Spinner size="sm" />}
                  loadingText={undefined}
                >
                  Generate
                </Button>
              </HStack>
            </Flex>
            <Flex direction={"column"} w="100%">
              <AutoResizeTextarea
                value={generateSQLQueryResult}
                minH={32}
                borderRadius={"none"}
                border={"none"}
                _focusVisible={{
                  border: "none",
                }}
                placeholder="Your generated query will appear here."
              />
              <Flex
                direction="row"
                w="100%"
                bg="gray.50"
                justify={"space-between"}
              >
                <Button
                  onClick={onCopy}
                  p={1}
                  m={0}
                  h={4}
                  fontSize={"sm"}
                  borderRadius={"none"}
                  bg="none"
                  color="gray.500"
                >
                  {hasCopied ? "Copied" : "Copy"}
                </Button>
                {isErrorGenerateSQLQuery && (
                  <Text
                    fontSize={"xs"}
                    color="red.300"
                    fontWeight={"bold"}
                    p={1}
                    m={0}
                    h={4}
                  >
                    Error generating query.
                  </Text>
                )}
              </Flex>
            </Flex>
          </VStack>
        </VStack>
      </Flex>
    </>
  );
}
