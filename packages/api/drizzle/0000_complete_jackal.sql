CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastActiveAt" timestamp DEFAULT now() NOT NULL,
	"browser" text NOT NULL,
	"os" text NOT NULL,
	"ip" text,
	"deletedAt" timestamp,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"orgNumber" text NOT NULL,
	"recoveryEmail" text,
	"password" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"modifiedAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp,
	CONSTRAINT "users_orgNumber_unique" UNIQUE("orgNumber")
);
--> statement-breakpoint
CREATE TABLE "verification_attempts" (
	"id" text PRIMARY KEY NOT NULL,
	"verificationRequestId" text NOT NULL,
	"verificationCode" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"orgNumber" text NOT NULL,
	"fikenEmail" text NOT NULL,
	"verificationCode" text NOT NULL,
	"verifiedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"deletedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_attempts" ADD CONSTRAINT "verification_attempts_verificationRequestId_verification_requests_id_fk" FOREIGN KEY ("verificationRequestId") REFERENCES "public"."verification_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "last_active_at_idx" ON "sessions" USING btree ("lastActiveAt");--> statement-breakpoint
CREATE INDEX "recovery_email_idx" ON "users" USING btree ("recoveryEmail");--> statement-breakpoint
CREATE INDEX "verification_request_id_idx" ON "verification_attempts" USING btree ("verificationRequestId");--> statement-breakpoint
CREATE INDEX "va_created_at_idx" ON "verification_attempts" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "verification_code_idx" ON "verification_requests" USING btree ("verificationCode");--> statement-breakpoint
CREATE INDEX "org_number_idx" ON "verification_requests" USING btree ("orgNumber");--> statement-breakpoint
CREATE INDEX "fiken_email_idx" ON "verification_requests" USING btree ("fikenEmail");--> statement-breakpoint
CREATE INDEX "vr_created_at_idx" ON "verification_requests" USING btree ("createdAt");