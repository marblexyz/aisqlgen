// TODO: Change this to use with a database hosted somewhere, like railway.
export const SAMPLE_PG_DB_CONFIG = {
  host: process.env.PGHOST !== undefined ? process.env.PGHOST : "localhost",
  port: process.env.PGPORT !== undefined ? Number(process.env.PGPORT) : 5432,
  database:
    process.env.PGDATABASE !== undefined ? process.env.PGDATABASE : "postgres",
  user: process.env.PGUSER !== undefined ? process.env.PGUSER : "postgres",
  password:
    process.env.PGPASSWPRD !== undefined ? process.env.PGPASSWPRD : "postgres",
};
