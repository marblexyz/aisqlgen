import { useAppSelector } from "@/hooks/reduxHooks";
import {
  selectDatasource,
  selectDatasourceMap,
} from "@/redux/slices/datasource/datasourceSliceSelectors";
import { Flex, useBoolean, useDisclosure } from "@chakra-ui/react";
import { FC, useState } from "react";
import { DatasourceInputModal } from "../datasource/DatasourceInputModal";
import { DatasourceDetailsPanel } from "./DatasourceDetailsPanel";
import { DatasourceListPanel } from "./DatasourceListPanel";

export const Sidebar: FC = () => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
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
  return (
    <Flex h="100%" borderRight="1px solid" borderColor="gray.100" w="xs">
      {showDetails === false && (
        <DatasourceListPanel
          onOpenDatasourceModal={onOpenDatasourceModal}
          datasourceMap={datasourceMap}
          onClickDatasourceListItem={handleClickDatasourceListItem}
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
