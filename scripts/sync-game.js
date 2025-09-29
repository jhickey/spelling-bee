const {PrismaClient} = require('@prisma/client');
const {z} = require('zod');
const fs = require('fs');
const {getWordsApiClient} = require("../src/clients/WordsApiClient");

const prisma = new PrismaClient();

// Validation schemas
const LettersSchema = z.array(z.string()).length(7);
const AnswersSchema = z.array(z.string().min(4));

(async () => {
    try {
        const response = await fetch(
            'https://www.nytimes.com/puzzles/spelling-bee'
        );
        const text = await response.text();
        const startIndex = text.indexOf('gameData') + 11;
        const endIndex = text.indexOf('}}', text.indexOf('gameData')) + 2;
        const data = JSON.parse(text.slice(startIndex, endIndex));
        fs.writeFileSync("/tmp/spelling-bee.json", JSON.stringify(data, null, 2));
        const proms = [data.today, data.yesterday, ...data.pastPuzzles.thisWeek, ...data.pastPuzzles.lastWeek].map(async day => {
            const {answers, validLetters, centerLetter, printDate} = day;
            const validatedAnswers = AnswersSchema.parse(answers);
            const validatedLetters = LettersSchema.parse(validLetters);
            const existing = await prisma.game.findUnique({
                where: {date: new Date(printDate)}
            });
            if (!existing) {
                await prisma.game.create({
                    data: {
                        answers: validatedAnswers,
                        centerLetter,
                        letters: validatedLetters,
                        date: new Date(printDate.concat("T04:00:00")),
                    }
                });
                console.log(`pulled game for ${printDate}`);
            }
            const wordsApiClient = getWordsApiClient();
            const proms = validatedAnswers.map(async answer => {
                const {frequency} = await wordsApiClient.getFrequency(answer);
                await prisma.dictionary.upsert({
                    where: {word: answer},
                    update: {
                        frequencyZipf: frequency.zipf || null,
                        frequencyPerMillion: frequency.perMillion,
                    },
                    create: {
                        word: answer,
                        isValid: true,
                        isBonus: false,
                        frequencyZipf: frequency.zipf || null,
                        frequencyPerMillion: frequency.perMillion,
                    }
                })
            });
            await Promise.all(proms);
        });
        await Promise.all(proms);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
})();
