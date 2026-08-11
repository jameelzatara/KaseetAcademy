CREATE TABLE "cohort_seats" (
	"cohort_id" integer PRIMARY KEY NOT NULL,
	"capacity" integer DEFAULT 10 NOT NULL,
	"enrolled" integer DEFAULT 0 NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "holds" (
	"id" text PRIMARY KEY NOT NULL,
	"cohort_id" integer NOT NULL,
	"order_id" text,
	"session_id" text,
	"expires_at" timestamp NOT NULL,
	"released_at" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "installments" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" text,
	"seq" integer NOT NULL,
	"amount_jod" numeric NOT NULL,
	"method" text,
	"paid_at" timestamp,
	"due_at" date,
	"reference" text,
	"recorded_by" text
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"session_id" text,
	"stripe_session_id" text,
	"payment_intent" text,
	"stripe_payment_id" text,
	"course_slug" text NOT NULL,
	"cohort_id" integer NOT NULL,
	"mode" text NOT NULL,
	"plan" text NOT NULL,
	"customer" jsonb NOT NULL,
	"first_name" text,
	"last_name" text,
	"phone" text,
	"email" text,
	"country" text,
	"city" text,
	"total_jod" integer NOT NULL,
	"total_usd" integer,
	"paid_jod" integer NOT NULL,
	"remaining_jod" integer NOT NULL,
	"amount_paid_minor" integer,
	"charged_usd" numeric,
	"currency" text DEFAULT 'usd',
	"status" text DEFAULT 'pending' NOT NULL,
	"installments" jsonb NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_session_id_unique" UNIQUE("session_id"),
	CONSTRAINT "orders_stripe_session_id_unique" UNIQUE("stripe_session_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"first_name" text NOT NULL,
	"last_name" text DEFAULT '',
	"phone" text DEFAULT '',
	"provider" text DEFAULT 'email' NOT NULL,
	"google_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
ALTER TABLE "installments" ADD CONSTRAINT "installments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;