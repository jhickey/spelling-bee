/*
  Warnings:

  - You are about to drop the column `answers` on the `game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."game" DROP COLUMN "answers";

-- CreateTable
CREATE TABLE "public"."_DictionaryToGame" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DictionaryToGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DictionaryToGame_B_index" ON "public"."_DictionaryToGame"("B");

-- AddForeignKey
ALTER TABLE "public"."_DictionaryToGame" ADD CONSTRAINT "_DictionaryToGame_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."dictionary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DictionaryToGame" ADD CONSTRAINT "_DictionaryToGame_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
