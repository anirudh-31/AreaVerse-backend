-- CreateTable
CREATE TABLE "public"."refreshtoken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "refreshtoken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refreshtoken_token_key" ON "public"."refreshtoken"("token");

-- CreateIndex
CREATE INDEX "refreshtoken_userId_idx" ON "public"."refreshtoken"("userId");

-- AddForeignKey
ALTER TABLE "public"."refreshtoken" ADD CONSTRAINT "refreshtoken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
