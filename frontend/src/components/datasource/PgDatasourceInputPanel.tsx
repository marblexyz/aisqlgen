import { DatasourceType } from "@/types/redux/slices/datasource";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, FormikProps, FormikProvider } from "formik";
import { FC } from "react";
import { BasicInput } from "../common/Input";
export type PostgresFormValues = {
  type: DatasourceType.Postgres;
  resourceName: string;
  host: string;
  port: string | number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
};

export const DEFAULT_PG_FORM_VALUES: PostgresFormValues = {
  type: DatasourceType.Postgres,
  resourceName: "",
  host: "",
  port: 5432,
  database: "",
  user: "",
  password: "",
  ssl: false,
};

export const validatePgFormValues = (values: PostgresFormValues) => {
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
  if (typeof values.port === "string") {
    const portIsNumeric = !isNaN(parseInt(values.port));
    if (!portIsNumeric) {
      errors.port = "Port must be a number";
    } else {
      const portNumber = parseInt(values.port);
      if (portNumber < 0 || portNumber > 65535) {
        errors.port = "Port must be between 0 and 65535";
      }
    }
  }

  if (values.database === "") {
    errors.database = "Required";
  }
  if (values.user === "") {
    errors.user = "Required";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: undefined };
  }
  return {
    errors,
    values: {
      ...values,
      port:
        typeof values.port === "number" ? values.port : parseInt(values.port),
    },
  };
};

export type PgDatasourceInputPanelProps = {
  formik: FormikProps<PostgresFormValues>;
};
export const PgDatasourceInputPanel: FC<PgDatasourceInputPanelProps> = ({
  formik,
}) => {
  const { errors, handleSubmit, touched } = formik;
  return (
    <FormikProvider value={formik}>
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
            <FormControl isInvalid={errors.host !== undefined && touched.host}>
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
            <FormControl isInvalid={errors.port !== undefined && touched.port}>
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
              isInvalid={errors.database !== undefined && touched.database}
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
            <FormControl isInvalid={errors.user !== undefined && touched.user}>
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
              isInvalid={errors.password !== undefined && touched.password}
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
            {/** Form control for ssl */}
            <FormControl isInvalid={errors.ssl !== undefined && touched.ssl}>
              <FormLabel htmlFor="ssl">
                <Text>SSL Mode</Text>
              </FormLabel>
              <Field
                required
                as={Switch}
                id="ssl"
                name="ssl"
                type="ssl"
                placeholder="Database ssl"
              />
              <FormErrorMessage>{errors.ssl}</FormErrorMessage>
            </FormControl>
          </VStack>
        </form>
      </Box>
    </FormikProvider>
  );
};
