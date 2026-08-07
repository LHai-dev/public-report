import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod/v4";

export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const rolesEnum = pgEnum("roles", [USER_ROLE.USER, USER_ROLE.ADMIN]);

export const userTable = pgTable("users", {
  id: t.integer().primaryKey().generatedByDefaultAsIdentity(),
  username: t.varchar({ length: 32 }).unique(),
  password: t.text(),
  email: t.varchar({ length: 254 }).unique().notNull(),
  role: rolesEnum("role").default(USER_ROLE.USER).notNull(),
  updatedAt: t.timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: t.timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }),
  activatedAt: t.timestamp("activated_at", {
    withTimezone: true,
    mode: "date",
  }),
});

export const emailSchema = z.email({
  error: "This is not a valid email.",
});

export const username = z
  .string()
  .min(3, { error: "Username must be at least 3 characters" })
  .max(20, { error: "Username cannot exceed 20 characters" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    error: "Only alphanumeric characters and underscores",
  });

export const passwordSchema = z
  .string()
  .min(8, { error: "Password must be at least 8 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    error: "Must contain at least one uppercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "Must contain at least one number",
  })
  .refine((password) => /[!@#$%^&*]/.test(password), {
    error: "Must contain at least one special character",
  });
export const createUserSchema = createInsertSchema(userTable);
export const createUserLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  token: z.string(),
});

export type Login = z.infer<typeof createUserLoginSchema>;
export type User = typeof userTable.$inferSelect;
