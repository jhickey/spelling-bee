-- CreateTable
CREATE TABLE "public"."dictionary" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "isBonus" BOOLEAN NOT NULL DEFAULT false,
    "frequency_zipf" DOUBLE PRECISION,
    "frequency_per_million" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dictionary_word_key" ON "public"."dictionary"("word");
