-- AddForeignKey
ALTER TABLE "public"."posthistory" ADD CONSTRAINT "posthistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
