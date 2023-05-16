import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, FormikProps, FormikProvider } from "formik";
import { FC } from "react";
import { BasicInput } from "../common/Input";
export type PostgresFormValues = {
  resourceName: string;
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
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
          </VStack>
        </form>
      </Box>
    </FormikProvider>
  );
};
