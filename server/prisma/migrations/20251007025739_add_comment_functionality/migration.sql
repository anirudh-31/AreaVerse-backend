-- DropForeignKey
ALTER TABLE "public"."image" DROP CONSTRAINT "image_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."posthistory" DROP CONSTRAINT "posthistory_postId_fkey";

-- CreateTable
CREATE TABLE "public"."comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comment_postId_idx" ON "public"."comment"("postId");

-- CreateIndex
CREATE INDEX "comment_parentId_idx" ON "public"."comment"("parentId");

-- CreateIndex
CREATE INDEX "comment_userId_idx" ON "public"."comment"("userId");

-- AddForeignKey
ALTER TABLE "public"."image" ADD CONSTRAINT "image_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posthistory" ADD CONSTRAINT "posthistory_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
