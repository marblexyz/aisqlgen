import { DatabaseRow } from "@/types/schema";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { FC } from "react";

type ResultTableProps = {
  data: DatabaseRow[];
};

export const ResultTable: FC<ResultTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <Text>No results found.</Text>;
  }
  const keys = Object.keys(data[0]);
  keys.sort();

  return (
    <VStack alignItems="left">
      <Text fontSize="sm" color="gray.600" fontWeight="bold">
        Showing {data.length} results.{" "}
        {data.length === 600
          ? "Results may have been trunctaed because it was too long."
          : ""}
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              {keys.map((key) => (
                <Th key={key}>{key}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((row, index) => (
              <Tr key={index}>
                {keys.map((key) => (
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  <Td py={1} fontSize="sm" key={key}>{`${row[key]}`}</Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
