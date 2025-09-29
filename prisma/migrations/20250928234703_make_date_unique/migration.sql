/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "game_date_key" ON "public"."game"("date");
