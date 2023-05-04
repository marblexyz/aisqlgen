import { CreatePGPoolConfig } from "@/types/schema";

export enum DatasourceType {
  Postgres = "Postgres",
  Custom = "Custom",
}

export type DatasourceConfigType = {
  resourceName: string;
} & CreatePGPoolConfig;

export type Datasource = {
  type: DatasourceType;
  config: DatasourceConfigType;
};

export type DatasourceMap = Record<string, Datasource | undefined>;

export type DatasourceMapState = {
  datasourceMap: DatasourceMap;
};
