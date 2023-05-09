import { useCheckConnection } from "@/hooks/mutations/useCheckConnection";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { upsertDatasource } from "@/redux/slices/datasource/datasourceSlice";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { Field, FormikProvider, useFormik } from "formik";
import { FC } from "react";
import { IoBanSharp, IoCheckmarkCircleSharp } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";
import { BasicButton } from "../common/BasicButton";
import { BasicLinkButton } from "../common/BasicLinkButton";
import { BasicInput } from "../common/Input";
import {
  DatasourceType,
  PGConnectionConfig,
} from "@/types/redux/slices/datasource";

type AddDatasourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddDatasource?: (id: string) => void;
  initialValues?: PostgresFormValues & { id: string };
};

type PostgresFormValues = {
  resourceName: string;
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
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
  const dispatch = useAppDispatch();
  const {
    mutate: checkPgConnection,
    isLoading: isCheckingConnection,
    isError: isErrorCheckingConnection,
    isSuccess: isSuccessCheckingConnection,
  } = useCheckConnection();
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
  const { validateForm, errors, handleSubmit, touched, values, resetForm } =
    formik;

  const handleAddDatasourceClick = async () => {
    await validateForm();
    const { values: validatedValues } = validateFormValues(values);
    if (validatedValues === undefined) {
      return;
    }

    const datasource = {
      id: initialValues !== undefined ? initialValues.id : uuidv4(),
      type: DatasourceType.Postgres,
      config: {
        ...validatedValues,
        type: DatasourceType.Postgres,
      } as PGConnectionConfig,
    };
    dispatch(upsertDatasource(datasource));
    resetForm();
    onClose();
    onAddDatasource?.(datasource.id);
  };

  const handleCheckPgConnectionClick = async () => {
    await validateForm();
    const { values: validatedValues } = validateFormValues(values);
    if (validatedValues === undefined) {
      return;
    }

    const datasource = {
      type: DatasourceType.Postgres,
      config: {
        ...validatedValues,
        type: DatasourceType.Postgres,
      } as PGConnectionConfig,
    };
    checkPgConnection(datasource);
  };
  const action = initialValues !== undefined ? "Edit" : "Add";
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent border="none" borderRadius={2}>
        <FormikProvider value={formik}>
          <ModalHeader>
            <Heading fontSize="md" color="gray.900">
              {action} datasource
            </Heading>
          </ModalHeader>
          <ModalCloseButton m={2} />
          <ModalBody>
            <Box maxW={"container.md"} w={"100%"}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl
                    isInvalid={
                      errors.resourceName !== undefined && touched.resourceName
                    }
                  >
                    <FormLabel htmlFor="resourceName">
                      <Text>Name</Text>
                    </FormLabel>
                    <Field
                      as={BasicInput}
                      required
                      id="resourceName"
                      name="resourceName"
                      type="text"
                      placeholder="Enter a name for this datasource"
                    />
                    <FormErrorMessage>{errors.resourceName}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={errors.host !== undefined && touched.host}
                  >
                    <FormLabel htmlFor="host">
                      <Text>Host</Text>
                    </FormLabel>
                    <Field
                      required
                      as={BasicInput}
                      id="host"
                      name="host"
                      type="host"
                      placeholder="Host name or IP address, e.g. localhost"
                    />
                    <FormErrorMessage>{errors.host}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={errors.port !== undefined && touched.port}
                  >
                    <FormLabel htmlFor="port">
                      <Text>Port</Text>
                    </FormLabel>
                    <Field
                      required
                      as={BasicInput}
                      id="port"
                      name="port"
                      placeholder="Port number, e.g. 5432"
                    />
                    <FormErrorMessage>{errors.port}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      errors.database !== undefined && touched.database
                    }
                  >
                    <FormLabel htmlFor="database">
                      <Text>Database</Text>
                    </FormLabel>
                    <Field
                      required
                      as={BasicInput}
                      id="database"
                      name="database"
                      type="text"
                      placeholder="Database name, e.g. postgres"
                    />
                    <FormErrorMessage>{errors.database}</FormErrorMessage>
                  </FormControl>
                  {/* Form control for user */}
                  <FormControl
                    isInvalid={errors.user !== undefined && touched.user}
                  >
                    <FormLabel htmlFor="user">
                      <Text>User</Text>
                    </FormLabel>
                    <Field
                      required
                      as={BasicInput}
                      id="user"
                      name="user"
                      type="text"
                      placeholder="Database user, e.g. postgres"
                    />
                    <FormErrorMessage>{errors.user}</FormErrorMessage>
                  </FormControl>
                  {/* Form control for password */}
                  <FormControl
                    isInvalid={
                      errors.password !== undefined && touched.password
                    }
                  >
                    <FormLabel htmlFor="password">
                      <Text>Password</Text>
                    </FormLabel>
                    <Field
                      required
                      as={BasicInput}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Database password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </form>
            </Box>
          </ModalBody>
          <ModalFooter>
            <VStack w="100%">
              <HStack width="100%" justify={"flex-end"}>
                <BasicLinkButton
                  onClick={handleCheckPgConnectionClick}
                  //   isDisabled={isSubmitOrTestDisabled}
                >
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
        </FormikProvider>
      </ModalContent>
    </Modal>
  );
};
