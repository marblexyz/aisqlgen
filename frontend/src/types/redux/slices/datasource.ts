export enum DatasourceType {
  Postgres = "Postgres",
  Sqlite = "Sqlite",
  ClickHouse = "ClickHouse",
}

export type ConnectionBase = {
  type: DatasourceType;
  resourceName: string;
};

export type PGConnectionConfig = ConnectionBase & {
  type: typeof DatasourceType.Postgres;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
};

export type ClickHouseConnectionConfig = ConnectionBase & {
  type: typeof DatasourceType.ClickHouse;
  host: string;
  user: string;
  password: string;
  database: string;
};

export type SQLiteConnectionConfig = ConnectionBase & {
  type: typeof DatasourceType.Sqlite;
  filename: string;
};

export type DatasourceConnectionConfig =
  | PGConnectionConfig
  | SQLiteConnectionConfig
  | ClickHouseConnectionConfig;

export type Datasource = {
  type: DatasourceType;
  config: DatasourceConnectionConfig;
};

export type DatasourceMap = Record<string, Datasource | undefined>;

export type DatasourceMapState = {
  datasourceMap: DatasourceMap;
};
