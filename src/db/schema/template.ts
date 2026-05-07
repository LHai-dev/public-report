import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import z from "zod/v4";

export const templateTable = pgTable("templates", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  commune: text("commune").notNull(),
  birth: timestamp("birth", {
    withTimezone: true,
    mode: "date",
  }),
  phoneNumber: text("phone_number").unique(),
  percentage: integer("percentage"),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});
export const TemplateInsertSchema = createInsertSchema(templateTable, {
  phoneNumber: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const TemplateUpdateSchema = createUpdateSchema(templateTable).omit({
  id: true,
});
export type Template = typeof templateTable.$inferSelect;
export type NewTemplate = z.infer<typeof TemplateInsertSchema>;
export type UpdateTemplate = z.infer<typeof TemplateUpdateSchema>;

export const TemplateWithTurnstileSchema = TemplateInsertSchema.extend({
  turnstileToken: z.string({ error: "Missing captcha token" }),
});

export type NewTemplateWithTurnstile = z.infer<
  typeof TemplateWithTurnstileSchema
>;
