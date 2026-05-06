import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});
export type DbType = NodePgDatabase<typeof schema>;

export const db = drizzle(pool, { schema });
