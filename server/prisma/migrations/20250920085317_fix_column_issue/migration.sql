/*
  Warnings:

  - You are about to drop the column `serverity` on the `post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."post" DROP COLUMN "serverity",
ADD COLUMN     "severity" "public"."Severity";
