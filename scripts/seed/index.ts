import { seedUsers } from "@/db/seed/user.seed";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  try {
    await seedUsers();

    console.log("Database seeding completed.");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
}

void main();
