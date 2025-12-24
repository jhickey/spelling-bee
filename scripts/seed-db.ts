import { prisma } from "@/lib/database.ts";

(async () => {
  try {
    await prisma.game.create({
      data: {
        answers: [
          "checkmate",
          "matchmake",
          "acme",
          "ahem",
          "came",
          "emcee",
          "hamate",
          "heme",
          "mace",
          "machete",
          "mahatma",
          "make",
          "mama",
          "mamma",
          "match",
          "matcha",
          "mate",
          "math",
          "matte",
          "meat",
          "mecca",
          "meek",
          "meet",
          "meme",
          "meta",
          "mete",
          "meth",
          "tame",
          "team",
          "teammate",
          "teem",
          "them",
          "theme",
        ],
        centerLetter: "m",
        letters: ["m", "a", "c", "e", "h", "k", "t"],
        date: "2023-09-04",
      },
    });
    console.log("Database seeded successfully");
  } catch (e) {
    console.error("Error seeding database:", e);
  } finally {
    await prisma.$disconnect();
  }
})();
