/*
  Warnings:

  - Made the column `print_date` on table `game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."game" ALTER COLUMN "print_date" SET NOT NULL;
