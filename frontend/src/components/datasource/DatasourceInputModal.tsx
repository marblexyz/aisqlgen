import { DatasourceType } from "@/types/redux/slices/datasource";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { BasicButton } from "../common/BasicButton";
import { DatasourceInputModalContent } from "./DatasourceInputModalContent";
import { DatasourceInputModalFormValues } from "./common";

type AddDatasourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddDatasource?: (id: string) => void;
  initialValues?: DatasourceInputModalFormValues;
};

export const DatasourceInputModal: FC<AddDatasourceModalProps> = ({
  isOpen,
  onClose,
  onAddDatasource,
  initialValues,
}) => {
  const [selectedDatasourceType, setSelectedDatasourceType] = useState<
    DatasourceType | undefined
  >(initialValues !== undefined ? initialValues.type : undefined);
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      {selectedDatasourceType === undefined && (
        <ModalContent>
          <ModalHeader>Add Datasource</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <BasicButton
                onClick={() =>
                  setSelectedDatasourceType(DatasourceType.Postgres)
                }
              >
                Postgres
              </BasicButton>
              <BasicButton
                onClick={() =>
                  setSelectedDatasourceType(DatasourceType.ClickHouse)
                }
              >
                ClickHouse
              </BasicButton>
            </VStack>
          </ModalBody>
        </ModalContent>
      )}
      {selectedDatasourceType !== undefined && (
        <DatasourceInputModalContent
          type={selectedDatasourceType}
          onClose={onClose}
          onAddDatasource={onAddDatasource}
          initialValues={initialValues}
        />
      )}
    </Modal>
  );
};
