import { useCheckConnection } from "@/hooks/mutations/useCheckConnection";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { upsertDatasource } from "@/redux/slices/datasource/datasourceSlice";
import {
  DatasourceConnectionConfig,
  DatasourceType,
  PGConnectionConfig,
} from "@/types/redux/slices/datasource";
import {
  HStack,
  Heading,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormikProps, useFormik } from "formik";
import { FC } from "react";
import { IoBanSharp, IoCheckmarkCircleSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { BasicButton } from "../common/BasicButton";
import { BasicLinkButton } from "../common/BasicLinkButton";
import {
  ChDatasourceInputPanel,
  ClickHouseFormValues,
  DEFAULT_CH_FORM_VALUES,
  validateChFormValues,
} from "./ChDatasourceInputPanel";
import {
  DEFAULT_PG_FORM_VALUES,
  PgDatasourceInputPanel,
  PostgresFormValues,
  validatePgFormValues,
} from "./PgDatasourceInputPanel";
import {
  DatasourceInputFormValues,
  DatasourceInputModalFormValues,
} from "./common";

const validateFormValues = (values: DatasourceInputFormValues) => {
  const type = values.type;
  switch (type) {
    case DatasourceType.Postgres:
      return validatePgFormValues(values);
    case DatasourceType.ClickHouse:
      return validateChFormValues(values);
    default:
      return { errors: { type: "Invalid datasource type" }, values: undefined };
  }
};

export const getInitialFormValues = (
  type: DatasourceType,
  initialValues?: DatasourceInputModalFormValues
): DatasourceInputFormValues => {
  switch (type) {
    case DatasourceType.ClickHouse: {
      const config =
        initialValues?.config !== undefined
          ? (initialValues.config as ClickHouseFormValues)
          : DEFAULT_CH_FORM_VALUES;
      return {
        type: DatasourceType.ClickHouse,
        resourceName: config.resourceName,
        host: config.host,
        database: config.database,
        user: config.user,
        password: config.password,
      };
    }
    case DatasourceType.Postgres:
    default: {
      const config =
        initialValues?.config !== undefined
          ? (initialValues.config as PGConnectionConfig)
          : DEFAULT_PG_FORM_VALUES;
      return {
        type: DatasourceType.Postgres,
        resourceName: config.resourceName,
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
      };
    }
  }
};
type DatasourceInputModalContentProps = {
  onClose: () => void;
  onAddDatasource?: (id: string) => void;
  initialValues?: DatasourceInputModalFormValues;
  type: DatasourceType;
};
export const DatasourceInputModalContent: FC<
  DatasourceInputModalContentProps
> = ({ onClose, onAddDatasource, initialValues, type }) => {
  const action = initialValues !== undefined ? "Edit" : "Add";
  const {
    mutate: checkConnection,
    isLoading: isCheckingConnection,
    isError: isErrorCheckingConnection,
    error: checkConnectionError,
    isSuccess: isSuccessCheckingConnection,
  } = useCheckConnection();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: getInitialFormValues(type, initialValues),
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

    const config: DatasourceConnectionConfig = validatedValues;
    const datasource = {
      id: initialValues !== undefined ? initialValues.id : uuidv4(),
      type,
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

    const config: DatasourceConnectionConfig = validatedValues;

    const datasource = {
      type,
      config,
    };
    checkConnection(datasource);
  };

  return (
    <ModalContent border="none" borderRadius={2}>
      <ModalHeader>
        <Heading fontSize="md" color="gray.900">
          {action} datasource
        </Heading>
      </ModalHeader>
      <ModalCloseButton m={2} />
      <ModalBody>
        {formik.values.type === DatasourceType.Postgres && (
          <PgDatasourceInputPanel
            formik={formik as FormikProps<PostgresFormValues>}
          />
        )}
        {formik.values.type === DatasourceType.ClickHouse && (
          <ChDatasourceInputPanel
            formik={formik as FormikProps<ClickHouseFormValues>}
          />
        )}
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
              {`The connection test failed. Please check your credentials and try
              again. ${checkConnectionError}`}
            </Text>
          )}
        </VStack>
      </ModalFooter>
    </ModalContent>
  );
};
