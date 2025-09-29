/*
  Warnings:

  - A unique constraint covering the columns `[nytimes_id]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."game_date_key";

-- AlterTable
ALTER TABLE "public"."game" ADD COLUMN     "nytimes_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "game_nytimes_id_key" ON "public"."game"("nytimes_id");
