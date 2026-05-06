ALTER TABLE "templates" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "credit_card" text;--> statement-breakpoint
ALTER TABLE "templates" ADD COLUMN "percentage" integer;--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_phone_number_unique" UNIQUE("phone_number");--> statement-breakpoint
ALTER TABLE "templates" ADD CONSTRAINT "templates_credit_card_unique" UNIQUE("credit_card");