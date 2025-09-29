/*
  Warnings:

  - You are about to drop the column `nytimes_id` on the `game` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nyt_id]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."game_nytimes_id_key";

-- AlterTable
ALTER TABLE "public"."game" DROP COLUMN "nytimes_id",
ADD COLUMN     "nyt_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "game_nyt_id_key" ON "public"."game"("nyt_id");
