-- CreateEnum
CREATE TYPE "public"."Severity" AS ENUM ('LOW', 'MEDIUM', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."PostType" AS ENUM ('ISSUE', 'QUERY', 'GENERAL');

-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('REPORTED', 'UNDER_REVIEW', 'APPROVED', 'MORE_INFO_NEEDED');

-- CreateTable
CREATE TABLE "public"."post" (
    "id" TEXT NOT NULL,
    "type" "public"."PostType" NOT NULL,
    "serverity" "public"."Severity",
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "public"."PostStatus" NOT NULL DEFAULT 'REPORTED',
    "feedback" TEXT,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
