CREATE TABLE IF NOT EXISTS "company" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"website" text,
	"ipo_status" text,
	"headquarters" text,
	"funding_type" text,
	"employee_count" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postings" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"job_title" text NOT NULL,
	"location" text,
	"workplace_type" varchar(50)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "postings" ADD CONSTRAINT "postings_company_id_company_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."company"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
