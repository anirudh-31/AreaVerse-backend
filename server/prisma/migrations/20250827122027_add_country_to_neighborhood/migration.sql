/*
  Warnings:

  - Added the required column `country` to the `neighborhood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."neighborhood" ADD COLUMN     "country" TEXT NOT NULL;
