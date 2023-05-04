import { AutoResizeTextarea } from "@/components/common/AutoResizeTextarea";
import { ResultTable } from "@/components/common/ResultTable";

import { FastModeSwitch } from "@/components/page/index/FastModeSwitch";
import { QueryHistory } from "@/components/page/index/QueryHistory";
import { SampleDataSwitch } from "@/components/page/index/SampleDataSwitch";
import { useExecuteSQLQuery } from "@/hooks/mutations/useExecuteSQLQuery";
import { useGenerateSQLQuery } from "@/hooks/mutations/useGenerateSQLQuery";
import { useGetPostgresSchema } from "@/hooks/queries/useGetPostgresSchema";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { selectOpenAIKey } from "@/redux/slices/config/configSliceSelector";
import {
  clearQueryHistory,
  deleteQuery,
  updateQuery,
} from "@/redux/slices/query/querySlice";
import { selectQuery } from "@/redux/slices/query/querySliceSelectors";
import { DatabaseRow } from "@/types/schema";
import {
  Button,
  Flex,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
  useBoolean,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { v4 } from "uuid";
import { DataSource, DataSourceMenu } from "../page/index/DataSourceMenu";
import { TimeoutText } from "./TimeoutText";

type QueryPanelProps = {
  id: string;
};

export const QueryPanel: FC<QueryPanelProps> = ({ id }) => {
  const dispatch = useAppDispatch();
  const queryItem = useAppSelector(selectQuery(id));
  const openAIKey = useAppSelector(selectOpenAIKey);
  const queryExecutionLogSorted = Object.values(queryItem.executionLog).sort(
    (a, b) => b.timestamp - a.timestamp
  );
  const lastQueryExecutionLog = queryExecutionLogSorted[0];

  const [command, setCommand] = useState<string>(
    queryExecutionLogSorted.length === 0 ? "" : lastQueryExecutionLog.command
  );
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource>(
    queryItem.dataSource
  );
  const [description, setDescription] = useState<string>(queryItem.description);
  const [useFastMode, setUseFastMode] = useBoolean(queryItem.useFastMode);
  const [useSampleData, setUseSampleData] = useBoolean(queryItem.useSampleData);
  const [executionId, setExecutionId] = useState<string | undefined>(
    queryExecutionLogSorted.length === 0 ? "" : lastQueryExecutionLog.id
  );
  const [userQuestion, setUserQuestion] = useState<string>(
    queryExecutionLogSorted.length === 0
      ? ""
      : lastQueryExecutionLog.userQuestion
  );
  const [queryResult, setQueryResult] = useState<DatabaseRow[] | undefined>(
    queryExecutionLogSorted.length === 0
      ? undefined
      : lastQueryExecutionLog.result
  );
  const [saveCount, setSaveCount] = useState<number>(0);
  const sampleDataInTableInfoRowCount = useSampleData ? 3 : 0;
  const {
    data: samplePostgresData,
    isLoading: isLoadingDbSchema,
    isError: isErrorDbSchema,
  } = useGetPostgresSchema({
    sampleRowsInTableInfo: sampleDataInTableInfoRowCount,
  });

  const handleGenerateSQLQuerySuccess = (result: string | undefined) => {
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

  const handleExecuteSQLQuerySuccess = (result: DatabaseRow[] | undefined) => {
    setQueryResult(result);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        executionLog: {
          ...queryItem.executionLog,
          [executionId as string]: {
            ...queryItem.executionLog[executionId as string],
            result: result,
          },
        },
      })
    );
  };

  const {
    mutate: generateSQLQuery,
    isError: isErrorGenerateSQLQuery,
    isLoading: isLoadingGenerateSQLQuery,
  } = useGenerateSQLQuery(handleGenerateSQLQuerySuccess);

  const { mutate: executeSQLQuery, isLoading: isLoadingExecuteSQLQuery } =
    useExecuteSQLQuery(handleExecuteSQLQuerySuccess);

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

  const handleSelectDataSource = (value: DataSource) => {
    setSelectedDataSource(value);
    setSaveCount(saveCount + 1);
    dispatch(
      updateQuery({
        id,
        dataSource: value,
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
  };
  const handleChangeUserQuestion = (
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
      query: command,
      dbSchema: samplePostgresData.schema,
      sampleRows: samplePostgresData.sampleRows,
      sequential: useFastMode,
      previousQueries: queryExecutionLogSorted
        .slice(0, 5)
        .map((queryExecutionLog) => {
          return {
            command: queryExecutionLog.command,
            userQuestion: queryExecutionLog.userQuestion,
          };
        }),
      openAIKey,
    });
  };
  const handleExecuteQuery = () => {
    executeSQLQuery({
      query: command,
    });
  };
  const handleDeleteQuery = () => {
    dispatch(
      deleteQuery({
        id,
      })
    );
  };
  const generateUserQueryIsDisabled =
    userQuestion === "" || isLoadingDbSchema || isErrorDbSchema;
  const runQueryIsDisabled = command === "" || isLoadingGenerateSQLQuery;
  const sqlQueryIsEmpty = command === "";

  return (
    <VStack
      w="container.lg"
      spacing={4}
      p={4}
      border="1px solid"
      borderColor="gray.100"
    >
      <HStack w="100%" justifyContent="space-between">
        <Input
          w="100%"
          h={12}
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Query description"
          variant="unstyled"
          fontSize="md"
          fontWeight="bold"
        />
        <TimeoutText baseText="" timeoutText="Saved" trigger={saveCount} />
      </HStack>
      <HStack w="100%" justifyContent={"space-between"}>
        <HStack>
          <DataSourceMenu
            value={selectedDataSource}
            onChange={handleSelectDataSource}
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
          textTransform={"uppercase"}
          fontWeight={"bold"}
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
        <VStack w="100%" bg={"purple.50"} alignItems="flex-start" px={2} py={2}>
          <Text
            textTransform={"uppercase"}
            fontWeight={"bold"}
            color={"purple.500"}
            fontSize={"xs"}
            whiteSpace={"nowrap"}
          >
            {sqlQueryIsEmpty ? "Generate" : "Edit"}
          </Text>
          <AutoResizeTextarea
            borderRadius={"none"}
            minH={10}
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
            onChange={handleChangeUserQuestion}
          />
          <HStack alignSelf={"end"}>
            <SampleDataSwitch
              isChecked={useSampleData}
              onToggle={handleToggleSampleData}
            />

            <FastModeSwitch
              isChecked={useFastMode}
              onToggle={handleToggleFastMode}
            />
            <Button
              onClick={handleGenerateQuery}
              fontSize={"md"}
              p={0}
              my={0}
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
          </Flex>
        </Flex>
      </VStack>
      {queryResult !== undefined && <ResultTable data={queryResult} />}
    </VStack>
  );
};
