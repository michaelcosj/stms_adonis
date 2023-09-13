/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from "@ioc:Adonis/Core/Env";
import type { DatabaseConfig } from "@ioc:Adonis/Lucid/Database";

const databaseConfig: DatabaseConfig = {
  connection: Env.get("DB_CONNECTION"),

  connections: {
    pg: {
      client: "pg",
      connection: {
        host: Env.get("PG_HOST"),
        port: Env.get("PG_PORT"),
        user: Env.get("PG_USER"),
        password: Env.get("PG_PASSWORD", ""),
        database: Env.get("PG_DB_NAME"),
        ssl: Env.get("NODE_ENV") === "development",
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },
  },
};

export default databaseConfig;
