import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  selectDatasource,
  selectDatasourceMap,
} from "@/redux/slices/datasource/datasourceSliceSelectors";
import { Flex, useBoolean, useDisclosure } from "@chakra-ui/react";
import { FC, useState } from "react";
import { DatasourceInputModal } from "../datasource/DatasourceInputModal";
import { DatasourceDetailsPanel } from "./DatasourceDetailsPanel";
import { DatasourceListPanel } from "./DatasourceListPanel";
import { getLocalDatasets } from "@/handlers/db/localdataset";
import {
  DatasourceType,
  SQLiteConnectionConfig,
} from "@/types/redux/slices/datasource";
import { upsertDatasource } from "@/redux/slices/datasource/datasourceSlice";
import { v4 } from "uuid";

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
    <Flex h="100%" borderRight="1px solid" borderColor="gray.100" w="xs">
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
      {/* We always render this component in case you accidentally close it when adding a db. */}
      <DatasourceInputModal
        isOpen={datasourceModalIsOpen}
        onClose={onCloseDatasourceModal}
      />
    </Flex>
  );
};
