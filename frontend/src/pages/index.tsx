import { AutoResizeTextarea } from "@/components/common/AutoResizeTextarea";
import { ResultTable } from "@/components/common/ResultTable";
import { Navbar } from "@/components/nav/Navbar";
import { Sidebar } from "@/components/nav/Sidebar";
import {
  DataSource,
  DataSourceRadioGroup,
} from "@/components/page/index/DataSourceRadioGroup";
import { FastModeSwitch } from "@/components/page/index/FastModeSwitch";
import { IndexHeader } from "@/components/page/index/IndexHeader";
import { QueryHistory } from "@/components/page/index/QueryHistory";
import { SampleDataSwitch } from "@/components/page/index/SampleDataSwitch";
import { useExecuteSQLQuery } from "@/hooks/mutations/useExecuteSQLQuery";
import { useGenerateSQLQuery } from "@/hooks/mutations/useGenerateSQLQuery";
import { useSamplePostgresData } from "@/hooks/queries/useSamplePostgresData";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { appendQuery } from "@/redux/slices/queryHistory/queryHistorySlice";
import { selectQueryHistory } from "@/redux/slices/queryHistory/queryHistorySliceSelectors";
import { CHAKRA_100VH } from "@/style/constants";
import { DatabaseRow } from "@/types/schema";
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
  Text,
  Textarea,
  VStack,
  useBoolean,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const dispatch = useAppDispatch();
  const queryHistory = useAppSelector(selectQueryHistory);
  const {
    value: query,
    setValue: setQuery,
    onCopy,
    hasCopied,
  } = useClipboard("");
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>(
    DataSource.SAMPLE
  );

  const [fastMode, setFastMode] = useBoolean(true);
  const [sampleDataInTableInfo, setSampleDataInTableInfo] = useBoolean(false);
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [queryResult, setQueryResult] = useState<DatabaseRow[] | undefined>(
    undefined
  );
  const sampleDataInTableInfoRowCount = sampleDataInTableInfo ? 3 : 0;
  const {
    data: samplePostgresData,
    isLoading: isLoadingDbSchema,
    isError: isErrorDbSchema,
  } = useSamplePostgresData(sampleDataInTableInfoRowCount);

  const onSuccessGenerateQuery = (result: string | undefined) => {
    if (result === undefined) {
      return;
    }
    setQuery(result);
    dispatch(
      appendQuery({
        query: result,
        userQuestion: userQuestion,
        timestamp: Date.now(),
      })
    );
  };

  const {
    mutate: generateSQLQuery,
    isError: isErrorGenerateSQLQuery,
    isLoading: isLoadingGenerateSQLQuery,
  } = useGenerateSQLQuery(onSuccessGenerateQuery);

  const { mutate: executeSQLQuery, isLoading: isLoadingExecuteSQLQuery } =
    useExecuteSQLQuery((result: DatabaseRow[] | undefined) => {
      setQueryResult(result);
    });

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

  useEffect(() => {
    if (queryHistory.queries.length > 0) {
      setQuery(queryHistory.queries[queryHistory.queries.length - 1].query);
      setUserQuestion(
        queryHistory.queries[queryHistory.queries.length - 1].userQuestion
      );
    }
  }, [queryHistory.queries, setQuery, setUserQuestion]);

  const showPreviewSchema = schemaString !== undefined && !isErrorDbSchema;

  const handleSelectDataSource = (value: DataSource) => {
    setSelectedDataSource(value);
  };
  const handleChangeSQLQuery = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setQuery(event.target.value);
  };
  const handleChangeUserQuery = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserQuestion(event.target.value);
  };

  const handleGenerateQuery = () => {
    if (userQuestion === "") {
      return;
    }
    if (samplePostgresData?.schema === undefined) {
      return;
    }
    generateSQLQuery({
      userQuestion,
      query,
      dbSchema: samplePostgresData.schema,
      sampleRows: samplePostgresData.sampleRows,
      sequential: fastMode,
      // Take last five executions if it exists
      previousQueries: queryHistory.queries.slice(
        queryHistory.queries.length - 5,
        queryHistory.queries.length
      ),
    });
  };
  const handleExecuteQuery = () => {
    executeSQLQuery({
      query,
    });
  };
  const generateUserQueryIsDisabled =
    userQuestion === "" || isLoadingDbSchema || isErrorDbSchema;
  const runQueryIsDisabled = query === "" || isLoadingGenerateSQLQuery;
  const sqlQueryIsEmpty = query === "";
  return (
    <Flex direction={"column"} h={CHAKRA_100VH}>
      <Navbar />
      <Flex h="100%">
        <Sidebar />
        <Flex direction={"column"} w="100%">
          <IndexHeader />
          <Flex w={"100%"} justify={"center"} align={"center"} px={4} pt={8}>
            <VStack w="container.lg" spacing={4}>
              <Heading size="md" textAlign={"left"} w="100%">
                Generate query
              </Heading>
              <Text w="100%">
                Select a data source, a schema, a table, and a question to
                generate your query.
              </Text>
              <Divider />
              <Heading size="sm" textAlign={"left"} w="100%">
                Data source
              </Heading>
              <Stack w="100%" m={2} spacing={3}>
                <DataSourceRadioGroup
                  value={selectedDataSource}
                  onChange={handleSelectDataSource}
                />
                <SampleDataSwitch
                  isChecked={sampleDataInTableInfo}
                  onToggle={setSampleDataInTableInfo.toggle}
                />
              </Stack>
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
              <QueryHistory />
              <VStack
                w="100%"
                border={"1px solid"}
                borderColor={"gray.100"}
                boxShadow={"xs"}
                borderRadius={"sm"}
                spacing={0}
                _focusWithin={{
                  border: "1px solid",
                  borderColor: "purple.300",
                }}
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
                    {sqlQueryIsEmpty ? "Generate" : "Edit"}
                  </Text>
                  <Flex w="100%">
                    <AutoResizeTextarea
                      borderRadius={"none"}
                      maxH={16}
                      value={userQuestion}
                      border={"none"}
                      _focusVisible={{
                        border: "none",
                      }}
                      py={1}
                      placeholder={
                        sqlQueryIsEmpty
                          ? "What query do you want to generate? E.g. List all orders from last week."
                          : "Edit your query. E.g. Join with table X."
                      }
                      w="100%"
                      px={0}
                      onChange={handleChangeUserQuery}
                    />
                  </Flex>
                  <HStack mx={1}>
                    <FastModeSwitch
                      isChecked={fastMode}
                      onToggle={setFastMode.toggle}
                    />
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
                      {sqlQueryIsEmpty ? "Generate" : "Edit"}
                    </Button>
                  </HStack>
                </Flex>
                <Flex direction={"column"} w="100%">
                  <AutoResizeTextarea
                    value={query}
                    onChange={handleChangeSQLQuery}
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
              <VStack>
                <Button
                  fontSize={"md"}
                  p={0}
                  my={0}
                  onClick={handleExecuteQuery}
                  h={8}
                  w={32}
                  borderRadius={"sm"}
                  bg={"purple.500"}
                  color={"white"}
                  _hover={{
                    bg: "purple.100",
                    cursor: "pointer",
                  }}
                  isLoading={isLoadingExecuteSQLQuery}
                  isDisabled={runQueryIsDisabled}
                  spinner={<Spinner size="sm" />}
                  loadingText={undefined}
                >
                  {"Execute"}
                </Button>
              </VStack>
              {queryResult !== undefined && <ResultTable data={queryResult} />}
            </VStack>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
