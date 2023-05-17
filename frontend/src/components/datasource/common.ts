import { Datasource } from "@/types/redux/slices/datasource";
import { ClickHouseFormValues } from "./ChDatasourceInputPanel";
import { PostgresFormValues } from "./PgDatasourceInputPanel";

export type BaseDatasourceInputModalInitialValues = {
  id: string;
};
export type DatasourceInputModalFormValues =
  BaseDatasourceInputModalInitialValues & Datasource;

export type DatasourceInputFormValues =
  | ClickHouseFormValues
  | PostgresFormValues;
