import { DatasourceType } from "@/types/redux/slices/datasource";
import {
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
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
            <VStack>
              <HStack spacing={2} w="100%">
                <BasicButton
                  onClick={() =>
                    setSelectedDatasourceType(DatasourceType.Postgres)
                  }
                  w="64"
                >
                  <HStack
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    w="100%"
                  >
                    <Image
                      src={`/logos/postgres.png`}
                      alt={`Postgres Logo`}
                      width={"15"}
                      height={"15"}
                    />
                    <Text>PostgreSQL</Text>
                  </HStack>
                </BasicButton>
                <BasicButton
                  onClick={() =>
                    setSelectedDatasourceType(DatasourceType.ClickHouse)
                  }
                  w="64"
                >
                  <HStack
                    spacing={2}
                    justifyContent="center"
                    alignItems="center"
                    w="100%"
                  >
                    <Image
                      src={`/logos/clickhouse.png`}
                      alt={`Postgres Logo`}
                      width={"15"}
                      height={"15"}
                    />
                    <Text>ClickHouse</Text>
                  </HStack>
                </BasicButton>
              </HStack>
              <Text>
                Need a different datasource?{" "}
                <Link
                  href="mailto:team@rizzgpt.app"
                  color="purple.500"
                  _hover={{ textDecor: "underline" }}
                >
                  Email us to request a new datasource
                </Link>{" "}
                or{" "}
                <Link
                  href="https://discord.gg/4DGNMe6pzW"
                  color="purple.500"
                  _hover={{ textDecor: "underline" }}
                >
                  reach out on Discord
                </Link>
                .
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter />
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
