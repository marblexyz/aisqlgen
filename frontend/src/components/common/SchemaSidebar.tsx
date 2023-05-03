import { DatabaseSchemaObject, PGTableSchema } from "@/types/schema";
import { TriangleDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  HStack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";

export type SchemaSidebarProps = {
  schema: DatabaseSchemaObject | undefined;
};

const SchemaInfoItem: FC<{ tableSchema: PGTableSchema }> = ({
  tableSchema,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Button
        display="flex"
        fontWeight={"normal"}
        justifyContent={"flex-start"}
        h="4"
        w="100%"
        onClick={onToggle}
        variant={"unstyled"}
        leftIcon={
          isOpen === true ? (
            <TriangleDownIcon h={2} w={2} />
          ) : (
            <TriangleDownIcon h={2} w={2} transform={`rotate(-90deg)`} />
          )
        }
      >
        {tableSchema.tableName}
      </Button>
      <Collapse in={isOpen} animateOpacity>
        {tableSchema.columns.map((column) => {
          return (
            <HStack key={column.name} px={4} fontSize="md">
              <Text>{column.name}:</Text>
              <Text>{column.columnType}</Text>
            </HStack>
          );
        })}
      </Collapse>
    </>
  );
};

export const SchemaSidebar: FC<SchemaSidebarProps> = ({ schema }) => {
  return (
    <VStack
      w="100%"
      alignItems={"flex-start"}
      px={2}
      pr={6}
      py={2}
      resize="both"
    >
      <Text fontSize="md" fontWeight="bold">
        Schema
      </Text>
      {schema === undefined && (
        <>
          <Text>No schema found.</Text>
        </>
      )}
      {schema !== undefined && (
        <>
          {Object.entries(schema).map(([_, tableSchema]) => {
            return (
              <SchemaInfoItem
                key={tableSchema.tableName}
                tableSchema={tableSchema}
              />
            );
          })}
        </>
      )}
    </VStack>
  );
};
