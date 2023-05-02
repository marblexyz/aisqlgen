import { CreatePGPoolConfig } from "@/types/schema";

export enum DatasourceType {
  Postgres = "Postgres",
}

export type DatasourceConfigType = CreatePGPoolConfig;

export type Datasource = {
  type: DatasourceType;
  config: DatasourceConfigType;
};

export type DatasourceMap = Record<string, Datasource>;

export type DatasourceMapState = {
  datasourceMap: DatasourceMap;
};
