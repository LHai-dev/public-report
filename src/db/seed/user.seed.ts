import { authService } from "@/auth";
import { db } from "@/db";
import { USER_ROLE, userTable } from "@/db/schema/user";

const DEFAULT_ADMIN_PASSWORD = "Admin@123";
const DEFAULT_USER_PASSWORD = "User@123";

export async function seedUsers(): Promise<void> {
  const now = new Date();

  const [adminPassword, userPassword] = await Promise.all([
    authService.hashPassword(DEFAULT_ADMIN_PASSWORD),
    authService.hashPassword(DEFAULT_USER_PASSWORD),
  ]);

  await db
    .insert(userTable)
    .values([
      {
        username: "admin1",
        email: "limhaifc@email.com",
        password: adminPassword,
        role: USER_ROLE.ADMIN,
        activatedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "user1",
        email: "user@email.com",
        password: userPassword,
        role: USER_ROLE.USER,
        activatedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .onConflictDoNothing({
      target: userTable.email,
    });

  console.log("Admin and user seed completed.");
}
