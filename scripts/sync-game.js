const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

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
        const {
            today: {answers, validLetters, centerLetter, printDate},
        } = data;
        
        // Validate data with Zod
        const validatedAnswers = AnswersSchema.parse(answers);
        const validatedLetters = LettersSchema.parse(validLetters);
        
        await prisma.game.create({
            data: {
                answers: validatedAnswers,
                centerLetter,
                letters: validatedLetters,
                date: printDate,
            }
        });
        
        console.log(`pulled game for ${printDate}`);
        await prisma.$disconnect();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
    }
})();
