/*
  Warnings:

  - Added the required column `title` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."post" ADD COLUMN     "title" TEXT NOT NULL;
