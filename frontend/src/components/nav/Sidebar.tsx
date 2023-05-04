import { useAppSelector } from "@/hooks/reduxHooks";
import { selectDatasourceMap } from "@/redux/slices/datasource/datasourceSliceSelectors";
import { Datasource } from "@/types/redux/slices/datasource";
import { Flex, useBoolean, useDisclosure } from "@chakra-ui/react";
import { FC, useState } from "react";
import { AddDatasourceModal } from "../datasource/AddDatasourceModal";
import { DatasourceDetailsPanel } from "./DatasourceDetailsPanel";
import { DatasourceListPanel } from "./DatasourceListPanel";

export const Sidebar: FC = () => {
  const {
    isOpen: datasourceModalIsOpen,
    onOpen: onOpenDatasourceModal,
    onClose: onCloseDatasourceModal,
  } = useDisclosure();
  const [showDetails, setShowDetails] = useBoolean(false);
  const [selectedDatasourceItem, setSelectedDatasourceItem] = useState<
    { id: string; datasource: Datasource } | undefined
  >(undefined);
  const datasourceMap = useAppSelector(selectDatasourceMap);
  const handleClickDatasourceListItem = (id: string) => {
    const datasource = datasourceMap[id];
    if (datasource === undefined) {
      return;
    }
    setShowDetails.on();
    setSelectedDatasourceItem({ id, datasource });
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
      {showDetails === true && selectedDatasourceItem !== undefined && (
        <DatasourceDetailsPanel
          datasourceId={selectedDatasourceItem.id}
          onReturnToList={setShowDetails.off}
          datasource={selectedDatasourceItem.datasource}
        />
      )}
      {/* We always render this component in case you accidentally close it when adding a db. */}
      <AddDatasourceModal
        isOpen={datasourceModalIsOpen}
        onClose={onCloseDatasourceModal}
      />
    </Flex>
  );
};
