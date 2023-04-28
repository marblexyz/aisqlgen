import { HStack, useRadioGroup } from "@chakra-ui/react";
import { FC } from "react";
import { DatasourceCard } from "./DataSourceCard";

export type DataSourceRadioGroupProps = {
  value: DataSource;
  onChange: (value: DataSource) => void;
};

export enum DataSource {
  POSTGRES = "postgres",
  SAMPLE = "sample",
  CUSTOM = "custom",
}

export type DataSourceType = {
  value: DataSource;
  label: string;
};

export const DataSourceRadioGroup: FC<DataSourceRadioGroupProps> = ({
  value,
  onChange,
}) => {
  const options: DataSourceType[] = [
    { value: DataSource.SAMPLE, label: "Sample Postgres" },
    { value: DataSource.POSTGRES, label: "PostgreSQL" },
    { value: DataSource.CUSTOM, label: "Custom schema" },
  ];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "datasource",
    defaultValue: value,
    onChange,
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((option) => {
        const radio = getRadioProps({ value: option.value });
        return <DatasourceCard key={option.value} option={option} {...radio} />;
      })}
    </HStack>
  );
};
