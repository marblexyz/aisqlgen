import { useCheckPgConnection } from "@/hooks/mutations/useCheckPgConnection";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { addDatasource } from "@/redux/slices/datasource/datasourceSlice";
import {
  DatasourceConfigType,
  DatasourceType,
} from "@/types/redux/slices/datasource";
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

type AddDatasourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
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
    } as DatasourceConfigType,
  };
};

export const AddDatasourceModal: FC<AddDatasourceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const {
    mutate: checkPgConnection,
    isLoading: isCheckingPgConnection,
    isError: isErrorCheckingPgConnection,
    isSuccess: isSuccessCheckingPgConnection,
  } = useCheckPgConnection();

  const formik = useFormik({
    initialValues: {
      resourceName: "",
      host: "",
      port: "",
      database: "",
      user: "",
      password: "",
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
      id: uuidv4(),
      type: DatasourceType.Postgres,
      config: validatedValues,
    };
    dispatch(addDatasource(datasource));
    resetForm();
    onClose();
  };

  const handleCheckPgConnectionClick = async () => {
    await validateForm();
    const { values: validatedValues } = validateFormValues(values);
    if (validatedValues === undefined) {
      return;
    }

    const datasource = {
      type: DatasourceType.Postgres,
      config: validatedValues,
    };
    checkPgConnection(datasource);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent border="none" borderRadius={2}>
        <FormikProvider value={formik}>
          <ModalHeader>
            <Heading fontSize="md" color="gray.900">
              Add datasource
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
                      {isCheckingPgConnection
                        ? "Testing connection"
                        : "Test connection"}
                    </Text>
                    {isErrorCheckingPgConnection && (
                      <Icon as={IoBanSharp} color="red.500" />
                    )}
                    {isSuccessCheckingPgConnection && (
                      <Icon as={IoCheckmarkCircleSharp} color="green.500" />
                    )}
                    {isCheckingPgConnection && (
                      <Spinner size="xs" color="purple.500" />
                    )}
                  </HStack>
                </BasicLinkButton>
                <BasicButton type="submit" onClick={handleAddDatasourceClick}>
                  Add datasource
                </BasicButton>
              </HStack>
              {isErrorCheckingPgConnection && (
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
