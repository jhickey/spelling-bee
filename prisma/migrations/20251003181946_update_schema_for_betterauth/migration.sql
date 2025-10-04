/*
  Warnings:

  - The primary key for the `account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `expires_at` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `provider_account_id` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `session` table. All the data in the column will be lost.
  - You are about to drop the `authenticator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `account` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `provider_id` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expires_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `token` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."authenticator" DROP CONSTRAINT "authenticator_user_id_fkey";

-- DropIndex
DROP INDEX "public"."session_sessionToken_key";

-- AlterTable
ALTER TABLE "public"."account" DROP CONSTRAINT "account_pkey",
DROP COLUMN "expires_at",
DROP COLUMN "provider",
DROP COLUMN "provider_account_id",
DROP COLUMN "session_state",
DROP COLUMN "token_type",
DROP COLUMN "type",
ADD COLUMN     "access_token_expires_at" TIMESTAMP(3),
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "provider_id" TEXT NOT NULL,
ADD COLUMN     "refresh_token_expires_at" TIMESTAMP(3),
ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."session" DROP COLUMN "expires",
DROP COLUMN "sessionToken",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "ip_address" TEXT,
ADD COLUMN     "token" TEXT NOT NULL,
ADD COLUMN     "user_agent" TEXT,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."authenticator";

-- DropTable
DROP TABLE "public"."verification_token";

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");
