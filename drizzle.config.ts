import type { Config } from "drizzle-kit";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  migrations: {
    prefix: "index",
    table: "__drizzle_migrations",
    schema: "public",
  },
}) satisfies Config;
