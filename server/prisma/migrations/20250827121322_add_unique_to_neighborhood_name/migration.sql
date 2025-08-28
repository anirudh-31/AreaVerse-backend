/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `neighborhood` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "neighborhood_name_key" ON "public"."neighborhood"("name");
