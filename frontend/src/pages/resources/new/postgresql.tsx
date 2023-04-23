import { Navbar } from "@/components/navigation/Navbar";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";

export default function Postgres() {
  const initialValues = {
    resourceName: "",
    host: "",
    port: "",
    database: "",
    user: "",
    password: "",
    useSSL: false,
  };
  return (
    <Box>
      <Navbar />
      <Flex w="100%" align={"center"} justify={"center"}>
        <Box maxW={"container.md"} w={"100%"}>
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              alert(JSON.stringify(values, null, 2));
            }}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl
                    isInvalid={
                      errors.resourceName !== undefined && touched.resourceName
                    }
                  >
                    <FormLabel htmlFor="resourceName">Name</FormLabel>
                    <Field
                      as={Input}
                      id="resourceName"
                      name="resourceName"
                      type="text"
                    />
                  </FormControl>
                  <FormControl
                    isInvalid={errors.host !== undefined && touched.host}
                  >
                    <FormLabel htmlFor="Host">Host</FormLabel>
                    <Field as={Input} id="host" name="host" type="host" />
                    <FormErrorMessage>{errors.host}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={errors.port !== undefined && touched.port}
                  >
                    <FormLabel htmlFor="port">Port</FormLabel>
                    <Field as={Input} id="port" name="port" type="number" />
                  </FormControl>
                  <FormControl
                    isInvalid={
                      errors.database !== undefined && touched.database
                    }
                  >
                    <FormLabel htmlFor="database">Database Name</FormLabel>
                    <Field
                      as={Input}
                      id="database"
                      name="database"
                      type="text"
                    />
                  </FormControl>
                  {/* Form control for user */}
                  <FormControl
                    isInvalid={errors.user !== undefined && touched.user}
                  >
                    <FormLabel htmlFor="user">User</FormLabel>
                    <Field as={Input} id="user" name="user" type="text" />
                  </FormControl>
                  {/* Form control for password */}
                  <FormControl
                    isInvalid={
                      errors.password !== undefined && touched.password
                    }
                  >
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                    />
                  </FormControl>
                  {/* Form control for useSSL */}
                  <Field as={Checkbox} id="useSSL" name="useSSL">
                    Use SSL?
                  </Field>
                  <Button type="submit" colorScheme="blue" width="full">
                    Login
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    </Box>
  );
}
