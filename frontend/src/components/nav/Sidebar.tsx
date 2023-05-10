import { getLocalDatasets } from "@/handlers/db/localdataset";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { upsertDatasource } from "@/redux/slices/datasource/datasourceSlice";
import {
  selectDatasource,
  selectDatasourceMap,
} from "@/redux/slices/datasource/datasourceSliceSelectors";
import {
  DatasourceType,
  SQLiteConnectionConfig,
} from "@/types/redux/slices/datasource";
import {
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  useBoolean,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { FC, useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { v4 } from "uuid";
import { DatasourceInputModal } from "../datasource/DatasourceInputModal";
import { DatasourceDetailsPanel } from "./DatasourceDetailsPanel";
import { DatasourceListPanel } from "./DatasourceListPanel";

export const Sidebar: FC = () => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
  const dispatch = useAppDispatch();
  const [showDetails, setShowDetails] = useBoolean(false);
  const [selectedDatasourceId, setSelectedDatasourceId] = useState<
    string | undefined
  >(undefined);
  const datasourceMap = useAppSelector(selectDatasourceMap);
  // need to do this so that an edit from child triggers re-render.
  const selectedDatasource = useAppSelector(
    selectDatasource(selectedDatasourceId)
  );
  const handleClickDatasourceListItem = (id: string) => {
    const datasource = datasourceMap[id];
    if (datasource === undefined) {
      return;
    }
    setShowDetails.on();
    setSelectedDatasourceId(id);
  };
  const handleClickUpdateLocal = async () => {
    // Load local datasets from /dataset directory
    const localDatasets = await getLocalDatasets();
    if (localDatasets.result !== undefined && localDatasets.result.length > 0) {
      // parse existing configs of sqlite
      let existingSqliteNames = new Set<string>();
      existingSqliteNames = new Set(
        Object.values(datasourceMap).map((datasource) => {
          if (
            datasource !== undefined &&
            datasource.type === DatasourceType.Sqlite
          ) {
            return datasource.config.resourceName;
          } else {
            return "";
          }
        })
      );
      for (const dataset of localDatasets.result) {
        if (existingSqliteNames.has(dataset)) {
          continue;
        }
        dispatch(
          upsertDatasource({
            id: v4(),
            type: DatasourceType.Sqlite,
            config: {
              type: DatasourceType.Sqlite,
              resourceName: dataset,
              filename: `dataset/${dataset}`,
            } as SQLiteConnectionConfig,
          })
        );
      }
    }
  };
  return (
    <Flex
      h="calc(100vh - 48px)"
      borderRight="1px solid"
      borderColor="gray.100"
      direction={"column"}
    >
      {showDetails === false && (
        <DatasourceListPanel
          onOpenDatasourceModal={onOpenDatasourceModal}
          datasourceMap={datasourceMap}
          onClickDatasourceListItem={handleClickDatasourceListItem}
          onClickUpdateLocal={handleClickUpdateLocal}
        />
      )}
      {showDetails === true &&
        selectedDatasourceId !== undefined &&
        selectedDatasource !== undefined && (
          <DatasourceDetailsPanel
            datasourceId={selectedDatasourceId}
            onReturnToList={setShowDetails.off}
            datasource={selectedDatasource}
          />
        )}
      <VStack
        position={"sticky"}
        bottom={0}
        w="100%"
        direction={"column"}
        p={4}
      >
        <Button
          variant="outline"
          backgroundColor="purple.900"
          border="none"
          _hover={{
            bg: "purple.600",
          }}
          w="100%"
          maxW="xs"
          borderRadius={2}
          h={8}
        >
          <Link
            href={`https://discord.gg/fV4DNCeZPq`}
            target={"_blank"}
            style={{ display: "flex", height: "100%" }}
          >
            <HStack w="100%" justify={"space-between"}>
              <Icon as={FaDiscord} color="white" />
              <Text color="white">Help</Text>
            </HStack>
          </Link>
        </Button>
        <Button
          variant="outline"
          borderColor="purple.900"
          border="1px solid"
          color="purple.900"
          _hover={{
            bg: "purple.50",
          }}
          w="100%"
          maxW="xs"
          borderRadius={2}
          h={8}
        >
          <Link
            href={`https://github.com/marblexyz/aisqlgen`}
            target={"_blank"}
            style={{ display: "flex", height: "100%" }}
          >
            <HStack w="100%" justify={"space-between"}>
              <Icon as={FaGithub} color="purple.900" />
              <Text>Run locally</Text>
            </HStack>
          </Link>
        </Button>
      </VStack>
      {/* We always render this component in case you accidentally close it when adding a db. */}
      <DatasourceInputModal
        isOpen={datasourceModalIsOpen}
        onClose={onCloseDatasourceModal}
      />
    </Flex>
  );
};
