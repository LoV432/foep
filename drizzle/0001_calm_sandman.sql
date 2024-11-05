ALTER TABLE "Courses" DROP CONSTRAINT "Courses_author_id_Users_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Courses" ADD CONSTRAINT "Courses_author_id_Users_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
