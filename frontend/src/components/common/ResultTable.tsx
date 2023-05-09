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
import { FC, memo } from "react";

type ResultTableProps = {
  data: DatabaseRow[];
};

const _ResultTable: FC<ResultTableProps> = ({ data }) => {
  if (data.length === 0) {
    return <Text>No results found.</Text>;
  }
  const keys = Object.keys(data[0]);
  keys.sort();

  return (
    <VStack alignItems="left">
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

// https://react.dev/reference/react/memo
export const ResultTable = memo(_ResultTable);
