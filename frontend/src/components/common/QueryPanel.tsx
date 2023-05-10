import { AutoResizeTextarea } from "@/components/common/AutoResizeTextarea";
import { FastModeSwitch } from "@/components/page/index/FastModeSwitch";
import { QueryHistory } from "@/components/page/index/QueryHistory";
import { SampleDataSwitch } from "@/components/page/index/SampleDataSwitch";
import { useExecuteSQLCommand } from "@/hooks/mutations/useExecuteSQLCommand";
import { useGenerateChart } from "@/hooks/mutations/useGenerateChart";
import { useGenerateSQLCommand } from "@/hooks/mutations/useGenerateSQLCommand";
import { useGetSchema } from "@/hooks/queries/useGetSchema";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectOpenAIKey } from "@/redux/slices/config/configSliceSelector";
import { selectDatasourceMap } from "@/redux/slices/datasource/datasourceSliceSelectors";
import {
  clearQueryHistory,
  deleteQuery,
  updateQuery,
} from "@/redux/slices/query/querySlice";
import { selectQuery } from "@/redux/slices/query/querySliceSelectors";
import { DatabaseRow } from "@/types/schema";
import {
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useBoolean,
} from "@chakra-ui/react";
import React, { FC, useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { DataSourceMenu } from "../page/index/DataSourceMenu";
import { GPT4Switch } from "../page/index/GPT4Switch";
import { BasicButton } from "./BasicButton";
import { ResultTable } from "./ResultTable";
import { TimeoutText } from "./TimeoutText";

type QueryPanelProps = {
  id: string;
};

export const QueryPanel: FC<QueryPanelProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const queryItem = useAppSelector(selectQuery(id));
  const openAIKey = useAppSelector(selectOpenAIKey);
  const dataSourceMap = useAppSelector(selectDatasourceMap);
  const queryExecutionLogSorted = Object.values(queryItem.executionLog).sort(
    (a, b) => b.timestamp - a.timestamp
  );
  const lastQueryExecutionLog = queryExecutionLogSorted[0];
  const [useGPT4, setUseGPT4] = useBoolean(true);
  const [command, setCommand] = useState<string>(
    queryExecutionLogSorted.length === 0 ? "" : lastQueryExecutionLog.command
  );
  const [selectedDataSourceId, setSelectedDataSourceId] = useState<
    string | undefined
  >(queryItem.dataSourceId);
  const [description, setDescription] = useState<string>(queryItem.description);
  const [useFastMode, setUseFastMode] = useBoolean(queryItem.useFastMode);
  const [useSampleData, setUseSampleData] = useBoolean(queryItem.useSampleData);
  const [executionId, setExecutionId] = useState<string>(
    queryExecutionLogSorted.length === 0 ? v4() : lastQueryExecutionLog.id
  );
  const [userQuestion, setUserQuestion] = useState<string>(
    queryExecutionLogSorted.length === 0
      ? ""
      : lastQueryExecutionLog.userQuestion
  );
  const [chartRequest, setChartRequest] = useState<string>("");
  const [queryResult, setQueryResult] = useState<DatabaseRow[] | undefined>(
    queryExecutionLogSorted.length === 0
      ? undefined
      : lastQueryExecutionLog.result
  );
  const [generateError, setGenerateError] = useState<string | undefined>(
    undefined
  );
  const [executeError, setExecuteError] = useState<string | undefined>(
    undefined
  );
  const [chartError, setChartError] = useState<string | undefined>(undefined);
  const [saveCount, setSaveCount] = useState<number>(0);
  const datasource =
    selectedDataSourceId !== undefined
      ? dataSourceMap[selectedDataSourceId]
      : undefined;
  const [isResultOpen, setIsResultOpen] = useBoolean(true);

  const sampleDataInTableInfoRowCount = useSampleData ? 3 : 0;
  const {
    data: samplePostgresData,
    isLoading: isLoadingDbSchema,
    isError: isErrorDbSchema,
  } = useGetSchema({
    sampleRowsInTableInfo: sampleDataInTableInfoRowCount,
    datasource,
  });

  const [chartCode, setChartCode] = useState<string | undefined>(
    queryExecutionLogSorted.length === 0
      ? undefined
      : lastQueryExecutionLog.chartCode
  );

  const [tabIndex, setTabIndex] = useState<number>(0);
  const handleGenerateCommandSuccess = (result: string | undefined) => {
    if (result === undefined) {
      return;
    }
    setCommand(result);
    const newExecutionId = v4();
    setExecutionId(newExecutionId);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        executionLog: {
          ...queryItem.executionLog,
          [newExecutionId]: {
            id: newExecutionId,
            userQuestion: userQuestion,
            command: result,
            timestamp: Date.now(),
          },
        },
      })
    );
  };

  const { mutate: generateSQLCommand, isLoading: isLoadingGenerateCommand } =
    useGenerateSQLCommand({
      onSuccess: handleGenerateCommandSuccess,
      onError: (error) => setGenerateError((error as Error).message),
    });

  const handleExecuteCommandSuccess = (result: DatabaseRow[] | undefined) => {
    setQueryResult(result);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        executionLog: {
          ...queryItem.executionLog,
          [executionId]: {
            ...queryItem.executionLog[executionId],
            result: result,
          },
        },
      })
    );
  };

  const { mutate: executeSQLCommand, isLoading: isLoadingExecuteSQLCommand } =
    useExecuteSQLCommand({
      onSuccess: handleExecuteCommandSuccess,
      onError: (error) => setExecuteError((error as Error).message),
    });

  const handleToggleFastMode = () => {
    setUseFastMode.toggle();
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        useFastMode: !useFastMode,
      })
    );
  };

  const handleToggleSampleData = () => {
    setUseSampleData.toggle();
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        useSampleData: !useSampleData,
      })
    );
  };

  const handleClearHistory = () => {
    dispatch(clearQueryHistory({ id }));
  };

  /** chart related start */
  const handleGenerateChartSuccess = (chartCode: string | undefined) => {
    setChartCode(chartCode);
    dispatch(
      updateQuery({
        id,
        executionLog: {
          ...queryItem.executionLog,
          [executionId]: {
            ...queryItem.executionLog[executionId],
            chartCode,
          },
        },
      })
    );
  };

  const { mutate: generateChart, isLoading: isLoadingGenerateChart } =
    useGenerateChart({
      onSuccess: handleGenerateChartSuccess,
      onError: (error) => setChartError((error as Error).message),
    });

  const handleGenerateChart = () => {
    generateChart({
      openAIKey,
      chartRequest,
      canvasId: id,
      model: useGPT4 ? "gpt-4" : "gpt-3.5-turbo",
      scriptId: `${id}-setupChartScript`,
      data: JSON.stringify(queryResult?.slice(0, 5)),
    });
  };

  const handleViewChart = useCallback(() => {
    // this gets initialized in the dangerous html. Because we provide scriptId
    // in handleGenerateChart, it will be referencable
    const script = document.getElementById(`${id}-setupChartScript`)?.innerHTML;
    if (script !== undefined) {
      try {
        window.eval(`const data = ${JSON.stringify(queryResult)}; \n${script}`);
      } catch (error) {
        // do nothing
        console.error(error);
      }
    }
  }, [id, queryResult]);

  /**
   * necessary to setup the dangerous html first.
   * */
  useEffect(() => {
    if (chartCode === undefined) {
      return;
    }
    handleViewChart();
  }, [chartCode, handleViewChart]);

  const handleTabSelect = (index: number) => {
    if (index === 1) {
      /**
       * the delay exists so that the chart.js
       * object in the chartCode has enough time to get initialized
       */
      setTimeout(() => {
        handleViewChart();
      }, 200);
    }
  };

  /** chart related end */
  const handleExecute = () => {
    setExecuteError(undefined);
    executeSQLCommand({
      query: command,
      datasource,
    });
    setTabIndex(0);
  };

  const handleSelectDataSourceId = (value: string) => {
    setSelectedDataSourceId(value);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        dataSourceId: value,
      })
    );
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        description: event.target.value,
      })
    );
  };

  const handleChangeSQLCommand = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommand(event.target.value);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        executionLog: {
          ...queryItem.executionLog,
          [executionId]: {
            id: executionId,
            userQuestion,
            command: event.target.value,
            timestamp: Date.now(),
          },
        },
      })
    );
  };

  const handleChangeUserQuestion = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setUserQuestion(event.target.value);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        executionLog: {
          ...queryItem.executionLog,
          [executionId]: {
            id: executionId,
            userQuestion: event.target.value,
            command,
            timestamp: Date.now(),
          },
        },
      })
    );
  };

  const handleChangeChartRequest = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setChartRequest(event.target.value);
  };

  const handleGenerateCommand = () => {
    if (userQuestion === "") {
      setGenerateError("User input is empty.");
      return;
    }
    if (datasource === undefined) {
      setGenerateError("No datasource found. Set the database connection.");
      return;
    }
    if (samplePostgresData?.schema === undefined) {
      setGenerateError(
        "No schema found. Set the database connection or make sure that the connection works. "
      );
      return;
    }
    setGenerateError("");
    generateSQLCommand({
      userQuestion,
      datasourceType: datasource.config.type,
      dbSchema: samplePostgresData.schema,
      query: command,
      sampleRows: samplePostgresData.sampleRows,
      sequential: useFastMode,
      previousQueries: queryExecutionLogSorted
        .slice(0, 2)
        .map((queryExecutionLog) => {
          return {
            command: queryExecutionLog.command,
            userQuestion: queryExecutionLog.userQuestion,
          };
        }),
      openAIKey,
    });
  };
  const handleDeleteQuery = () => {
    dispatch(
      deleteQuery({
        id,
      })
    );
  };
  const generateCommandIsDisabled =
    userQuestion === "" || isLoadingDbSchema || isErrorDbSchema;
  const executeCommandIsDisabled = command === "" || isLoadingGenerateCommand;
  const runChartGenerateIsDisabled =
    executeCommandIsDisabled || queryResult === undefined;
  const commandIsEmpty = command === "";

  return (
    <VStack
      w="100%"
      maxW="container.xl"
      spacing={4}
      p={4}
      border="1px solid"
      borderColor="gray.100"
    >
      {/** Title */}
      <HStack w="100%" justifyContent="space-between">
        <VStack spacing={0} w="100%" alignItems={"left"}>
          <Input
            w="100%"
            h={12}
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Input a title of the query"
            variant="unstyled"
            fontSize="lg"
            fontWeight="bold"
          />
        </VStack>
        <TimeoutText
          fontSize="sm"
          baseText=""
          timeoutText="Saved"
          trigger={saveCount}
        />
      </HStack>
      {/** Action Options */}
      <HStack w="100%" justifyContent={"space-between"}>
        <HStack>
          <DataSourceMenu
            value={selectedDataSourceId}
            onChange={handleSelectDataSourceId}
          />
          <QueryHistory
            executionLog={queryExecutionLogSorted}
            onClearHistory={handleClearHistory}
          />
        </HStack>
        <Button
          h={8}
          w={32}
          borderRadius={"sm"}
          onClick={handleDeleteQuery}
          color={"red.500"}
          fontSize={"xs"}
          variant="outline"
          borderColor={"red.500"}
          _hover={{
            bg: "red.50",
          }}
        >
          Delete
        </Button>
      </HStack>
      {/** Generate Panel */}
      <VStack w="100%" spacing={0}>
        <VStack
          w="100%"
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"sm"}
          boxShadow={"xs"}
          spacing={0}
          _focusWithin={{
            border: "1px solid",
            borderColor: "purple.300",
          }}
        >
          <VStack
            w="100%"
            bg={"purple.50"}
            alignItems="flex-start"
            px={2}
            py={2}
          >
            <Text color={"purple.500"} fontSize={"xs"} whiteSpace={"nowrap"}>
              {commandIsEmpty ? "Generate" : "Edit"}
            </Text>
            <AutoResizeTextarea
              borderRadius={"none"}
              minH={10}
              maxH={40}
              value={userQuestion}
              border={"none"}
              _focusVisible={{
                border: "none",
              }}
              py={1}
              placeholder={
                commandIsEmpty
                  ? "What query do you want to generate? E.g. List all orders from last week."
                  : "Edit your query. E.g. Join with table X."
              }
              w="100%"
              px={0}
              onChange={handleChangeUserQuestion}
            />
            <HStack w="100%" justifyContent={"space-between"}>
              <Flex alignItems="center">
                {generateError !== undefined && (
                  <Text fontSize={"sm"} color="red.300" fontWeight={"bold"}>
                    {generateError}
                  </Text>
                )}
              </Flex>
              <HStack>
                <SampleDataSwitch
                  isChecked={useSampleData}
                  onToggle={handleToggleSampleData}
                />

                <FastModeSwitch
                  isChecked={useFastMode}
                  onToggle={handleToggleFastMode}
                />
                <BasicButton
                  onClick={handleGenerateCommand}
                  bg={"purple.500"}
                  color={"white"}
                  display="flex"
                  w={32}
                  _hover={{
                    bg: "purple.300",
                    cursor: "pointer",
                  }}
                  _active={{
                    bg: "purple.300",
                    cursor: "pointer",
                  }}
                  _focus={{
                    bg: "purple.300",
                    cursor: "pointer",
                  }}
                  _disabled={{
                    bg: "purple.300",
                  }}
                  isLoading={isLoadingGenerateCommand}
                  isDisabled={generateCommandIsDisabled}
                  spinner={<Spinner size="sm" />}
                  loadingText={undefined}
                >
                  {commandIsEmpty ? "Generate" : "Edit Query"}
                </BasicButton>
              </HStack>
            </HStack>
          </VStack>
          <Flex direction={"column"} w="100%">
            <AutoResizeTextarea
              value={command}
              onChange={handleChangeSQLCommand}
              minH={32}
              px={2}
              borderRadius={"none"}
              border={"none"}
              _focusVisible={{
                border: "none",
              }}
              placeholder="Copy / paste a SQL query to edit, or generate one from above."
            />
            <Flex
              direction="row"
              w="100%"
              bg="gray.50"
              justify={"space-between"}
              p={2}
            >
              <Flex alignItems="center">
                {executeError !== undefined && (
                  <Text fontSize={"sm"} color="red.300" fontWeight={"bold"}>
                    {executeError}
                  </Text>
                )}
              </Flex>
              <BasicButton
                onClick={handleExecute}
                bg={"purple.500"}
                color={"white"}
                display="flex"
                w={32}
                _hover={{
                  bg: "purple.300",
                  cursor: "pointer",
                }}
                _active={{
                  bg: "purple.300",
                  cursor: "pointer",
                }}
                _focus={{
                  bg: "purple.300",
                  cursor: "pointer",
                }}
                _disabled={{
                  bg: "purple.300",
                }}
                isDisabled={executeCommandIsDisabled}
                spinner={<Spinner size="sm" />}
                loadingText={undefined}
              >
                {"Execute"}
              </BasicButton>
            </Flex>
          </Flex>
        </VStack>

        {/** Results tab */}
        <Tabs
          index={tabIndex}
          colorScheme="purple"
          w="100%"
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"sm"}
          onChange={handleTabSelect}
        >
          <TabList display="flex" justifyContent={"space-between"}>
            <HStack spacing={0} h={8}>
              <Tab
                onClick={() => {
                  setTabIndex(0);
                }}
                h={8}
                color={tabIndex === 0 ? "purple.500" : "gray.500"}
                fontWeight={tabIndex === 0 ? "bold" : "normal"}
                borderColor={tabIndex === 0 ? "purple.500" : "transparent"}
              >
                Result
              </Tab>
              <Tab
                onClick={() => {
                  setTabIndex(1);
                }}
                h={8}
                color={tabIndex === 1 ? "purple.500" : "gray.500"}
                fontWeight={tabIndex === 1 ? "bold" : "normal"}
                borderColor={tabIndex === 1 ? "purple.500" : "transparent"}
              >
                Chart
              </Tab>
            </HStack>
          </TabList>
          <TabPanels>
            {/** Results tab */}
            <TabPanel
              w="100%"
              px={2}
              display="flex"
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              {!isLoadingExecuteSQLCommand &&
                executeError === undefined &&
                queryResult === undefined && (
                  <Text fontSize="md" color="gray.500">
                    {`Run the query by clicking 'Execute'.`}
                  </Text>
                )}
              {isLoadingExecuteSQLCommand && <Spinner />}
              {!isLoadingExecuteSQLCommand && executeError !== undefined && (
                <Text fontSize={"sm"} color="red.300" fontWeight={"bold"}>
                  Error: {executeError}
                </Text>
              )}
              {!isLoadingExecuteSQLCommand &&
                executeError === undefined &&
                queryResult !== undefined && (
                  <VStack w="100%" alignItems={"flex-start"}>
                    <HStack w="100%" justifyContent={"space-between"}>
                      <Text fontSize="sm" color="gray.600" fontWeight="bold">
                        Showing {queryResult.length} results.{" "}
                        {queryResult.length === 600
                          ? "Results may have been trunctaed because it was too long."
                          : ""}
                      </Text>
                      <BasicButton
                        variant="unstyled"
                        display="flex"
                        w={32}
                        onClick={() => {
                          setIsResultOpen.toggle();
                        }}
                      >{`${isResultOpen ? "Hide" : "Show"}`}</BasicButton>
                    </HStack>
                    <Box overflowX={"auto"} w="100%">
                      <Collapse in={isResultOpen} animateOpacity>
                        <ResultTable data={queryResult} />
                      </Collapse>
                    </Box>
                  </VStack>
                )}
            </TabPanel>
            {/** Chart tab */}
            <TabPanel
              p={0}
              display="flex"
              flexDirection={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <AutoResizeTextarea
                value={chartRequest}
                onChange={handleChangeChartRequest}
                minH={16}
                px={2}
                borderRadius={"none"}
                border={"none"}
                _focusVisible={{
                  border: "none",
                }}
                placeholder="Describe the chart. e.g. line chart with red line. Default: whatever is most appropriate. "
              />
              <HStack
                direction="row"
                w="100%"
                bg="gray.50"
                alignItems={"center"}
                justifyContent={"space-between"}
                p={2}
                position="relative"
              >
                {chartError !== undefined && (
                  <Text fontSize={"sm"} color="red.300" fontWeight={"bold"}>
                    `Error: ${chartError}`
                  </Text>
                )}
                {chartError === undefined && (
                  <Text
                    fontSize="sm"
                    color={"gray.600"}
                  >{`Pro-tip: If you don't see a chart, try re-running or make the description a bit clearer.`}</Text>
                )}
                <HStack>
                  <GPT4Switch
                    isChecked={useGPT4}
                    onToggle={setUseGPT4.toggle}
                  />
                  <Popover placement="bottom">
                    <PopoverTrigger>
                      <Button
                        fontWeight="normal"
                        fontSize="sm"
                        borderRadius="sm"
                        h="8"
                      >
                        <Text>View chart code</Text>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent w="100%" maxW="container.md">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody fontSize="md" mr="8" mt="6" minH={10}>
                        <Text>
                          {chartCode !== undefined
                            ? chartCode
                            : "No existing chart code."}
                        </Text>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <BasicButton
                    onClick={handleGenerateChart}
                    bg={"purple.500"}
                    color={"white"}
                    display="flex"
                    w={32}
                    _hover={{
                      bg: "purple.300",
                      cursor: "pointer",
                    }}
                    _active={{
                      bg: "purple.300",
                      cursor: "pointer",
                    }}
                    _focus={{
                      bg: "purple.300",
                      cursor: "pointer",
                    }}
                    _disabled={{
                      bg: "purple.300",
                    }}
                    isLoading={isLoadingGenerateChart}
                    isDisabled={runChartGenerateIsDisabled}
                    spinner={<Spinner size="sm" />}
                  >
                    {"Generate chart"}
                  </BasicButton>
                </HStack>
              </HStack>
              <Flex
                w="100%"
                minH={48}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {isLoadingGenerateChart && <Spinner />}
                {!isLoadingGenerateChart &&
                  chartCode !== undefined &&
                  tabIndex === 1 && (
                    <Flex
                      flexDirection={"column"}
                      w="100%"
                      justifyContent={"center"}
                      alignItems={"center"}
                      minH={32}
                    >
                      <div dangerouslySetInnerHTML={{ __html: chartCode }} />
                    </Flex>
                  )}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </VStack>
  );
};
