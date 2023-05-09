export enum DatasourceType {
  Postgres = "Postgres",
  Sqlite = "Sqlite",
}

export type ConnectionBase = {
  resourceName: string;
};

export type PGConnectionConfig = ConnectionBase & {
  type: DatasourceType.Postgres;
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
};

export type SQLiteConnectionConfig = ConnectionBase & {
  type: DatasourceType.Sqlite;
  filename: string;
};

export type DatasourceConnectionConfig =
  | PGConnectionConfig
  | SQLiteConnectionConfig;

export type Datasource = {
  type: DatasourceType;
  config: DatasourceConnectionConfig;
};

export type DatasourceMap = Record<string, Datasource | undefined>;

export type DatasourceMapState = {
  datasourceMap: DatasourceMap;
};
