import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: `postgres://postgres:dbc625c9fc3e91cf@217.216.32.43:2222/form-db`,
  },
  migrations: {
    prefix: "index",
    table: "__drizzle_migrations",
    schema: "public",
  },
}) satisfies Config;
