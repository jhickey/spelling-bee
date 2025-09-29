/*
  Warnings:

  - You are about to drop the column `words` on the `game_session` table. All the data in the column will be lost.
  - You are about to drop the `_DictionaryToGame` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dictionary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_DictionaryToGame" DROP CONSTRAINT "_DictionaryToGame_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DictionaryToGame" DROP CONSTRAINT "_DictionaryToGame_B_fkey";

-- AlterTable
ALTER TABLE "public"."game_session" DROP COLUMN "words";

-- DropTable
DROP TABLE "public"."_DictionaryToGame";

-- DropTable
DROP TABLE "public"."dictionary";

-- CreateTable
CREATE TABLE "public"."word" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "isBonus" BOOLEAN NOT NULL DEFAULT false,
    "frequency_zipf" DOUBLE PRECISION,
    "frequency_per_million" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_GameToWord" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameToWord_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_GameSessionToWord" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GameSessionToWord_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "word_value_key" ON "public"."word"("value");

-- CreateIndex
CREATE INDEX "_GameToWord_B_index" ON "public"."_GameToWord"("B");

-- CreateIndex
CREATE INDEX "_GameSessionToWord_B_index" ON "public"."_GameSessionToWord"("B");

-- AddForeignKey
ALTER TABLE "public"."_GameToWord" ADD CONSTRAINT "_GameToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameToWord" ADD CONSTRAINT "_GameToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameSessionToWord" ADD CONSTRAINT "_GameSessionToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."game_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_GameSessionToWord" ADD CONSTRAINT "_GameSessionToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
