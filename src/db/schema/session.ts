import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { userTable } from "./user";
import { createInsertSchema } from "drizzle-zod";
import z from "zod/v4";

export const sessionTable = pgTable("session", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  token: t.text(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => userTable.id),
  ipAddress: t.text("ip_address"),
  userAgent: t.text("user_agent"),
  expiresAt: t
    .timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    })
    .notNull(),
});

export const insertSessionSchema = createInsertSchema(sessionTable);

export type NewSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessionTable.$inferSelect;
