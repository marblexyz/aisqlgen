import { useCheckConnection } from "@/hooks/mutations/useCheckConnection";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { upsertDatasource } from "@/redux/slices/datasource/datasourceSlice";
import {
  DatasourceConnectionConfig,
  DatasourceType,
} from "@/types/redux/slices/datasource";
import {
  HStack,
  Heading,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { FC } from "react";
import { IoBanSharp, IoCheckmarkCircleSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { BasicButton } from "../common/BasicButton";
import { BasicLinkButton } from "../common/BasicLinkButton";
import {
  PgDatasourceInputPanel,
  PostgresFormValues,
} from "./PgDatasourceInputPanel";

type AddDatasourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddDatasource?: (id: string) => void;
  initialValues?: PostgresFormValues & { id: string };
};

const validateFormValues = (values: PostgresFormValues) => {
  const errors: Record<string, string> = {};
  //  TODO: add validation for port, database, user, password
  if (values.resourceName === "") {
    errors.resourceName = "Required";
  }
  if (values.host === "") {
    errors.host = "Required";
  }
  if (values.port === "") {
    errors.port = "Required";
  }
  const portIsNumeric = !isNaN(parseInt(values.port));
  if (!portIsNumeric) {
    errors.port = "Port must be a number";
  } else {
    const portNumber = parseInt(values.port);
    if (portNumber < 0 || portNumber > 65535) {
      errors.port = "Port must be between 0 and 65535";
    }
  }

  if (values.database === "") {
    errors.database = "Required";
  }
  if (values.user === "") {
    errors.user = "Required";
  }
  if (values.password === "") {
    errors.password = "Required";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, values: undefined };
  }
  return {
    errors,
    values: {
      ...values,
      port: parseInt(values.port),
    },
  };
};
export const DatasourceInputModal: FC<AddDatasourceModalProps> = ({
  isOpen,
  onClose,
  onAddDatasource,
  initialValues,
}) => {
  const action = initialValues !== undefined ? "Edit" : "Add";
  const {
    mutate: checkConnection,
    isLoading: isCheckingConnection,
    isError: isErrorCheckingConnection,
    isSuccess: isSuccessCheckingConnection,
  } = useCheckConnection();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      resourceName:
        initialValues !== undefined ? initialValues.resourceName : "",
      host: initialValues !== undefined ? initialValues.host : "",
      port: initialValues !== undefined ? initialValues.port.toString() : "",
      database: initialValues !== undefined ? initialValues.database : "",
      user: initialValues !== undefined ? initialValues.user : "",
      password: initialValues !== undefined ? initialValues.password : "",
    },
    validate: (values) => validateFormValues(values).errors,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const { validateForm, values, resetForm } = formik;

  const handleAddDatasourceClick = async () => {
    await validateForm();
    const { values: validatedValues } = validateFormValues(values);
    if (validatedValues === undefined) {
      return;
    }

    const config: DatasourceConnectionConfig = {
      ...validatedValues,
      type: DatasourceType.Postgres,
    };
    const datasource = {
      id: initialValues !== undefined ? initialValues.id : uuidv4(),
      type: DatasourceType.Postgres,
      config,
    };
    dispatch(upsertDatasource(datasource));
    resetForm();
    onClose();
    onAddDatasource?.(datasource.id);
  };

  const handleCheckConnectionClick = async () => {
    await validateForm();
    const { values: validatedValues } = validateFormValues(values);
    if (validatedValues === undefined) {
      return;
    }

    const config: DatasourceConnectionConfig = {
      ...validatedValues,
      type: DatasourceType.Postgres,
    };

    const datasource = {
      type: DatasourceType.Postgres,
      config,
    };
    checkConnection(datasource);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent border="none" borderRadius={2}>
        <ModalHeader>
          <Heading fontSize="md" color="gray.900">
            {action} datasource
          </Heading>
        </ModalHeader>
        <ModalCloseButton m={2} />
        <ModalBody>
          <PgDatasourceInputPanel formik={formik} />
        </ModalBody>
        <ModalFooter>
          <VStack w="100%">
            <HStack width="100%" justify={"flex-end"}>
              <BasicLinkButton onClick={handleCheckConnectionClick}>
                <HStack w="100%">
                  <Text w="100%">
                    {isCheckingConnection
                      ? "Testing connection"
                      : "Test connection"}
                  </Text>
                  {isErrorCheckingConnection && (
                    <Icon as={IoBanSharp} color="red.500" />
                  )}
                  {isSuccessCheckingConnection && (
                    <Icon as={IoCheckmarkCircleSharp} color="green.500" />
                  )}
                  {isCheckingConnection && (
                    <Spinner size="xs" color="purple.500" />
                  )}
                </HStack>
              </BasicLinkButton>
              <BasicButton
                borderRadius={"sm"}
                bg={"purple.500"}
                color={"white"}
                _hover={{
                  bg: "purple.100",
                  cursor: "pointer",
                }}
                _active={{
                  bg: "purple.100",
                  cursor: "pointer",
                }}
                _focus={{
                  bg: "purple.100",
                  cursor: "pointer",
                }}
                type="submit"
                onClick={handleAddDatasourceClick}
              >
                {action} datasource
              </BasicButton>
            </HStack>
            {isErrorCheckingConnection && (
              <Text color="red.500" fontSize={"sm"} textAlign={"center"}>
                The connection test failed. Please check your credentials and
                try again.
              </Text>
            )}
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
