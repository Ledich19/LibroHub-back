import { seed } from "drizzle-seed";
import * as schema from "../schema";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

// fake seeds
const languageCodes = [
  "uk",
  "en",
  "ru",
  "es",
  "fr",
  "de",
  "zh",
  "ja",
  "pt",
  "hi",
  "pl",
  "cs",
  "kk",
];
const publishers = [
  "Penguin Random House",
  "HarperCollins",
  "Simon & Schuster",
  "Hachette Book Group",
  "Macmillan Publishers",
];

export const mockSeedsRun = async (db: NodePgDatabase<typeof schema>) => {
  await seed(db, { users: schema.usersTable }).refine((f) => ({
    users: {
      columns: {
        name: f.fullName(),
      },
      count: 20,
    },
  }));

  // await seed(db, { authors: schema.authorsTable }).refine((f) => ({
  //   authors: {
  //     count: 10,
  //     columns: {
  //       firstName: f.firstName(),
  //       lastName: f.lastName(),
  //     },
  //   },
  // }));

  // await seed(db, {bookSeries: schema.seriesTable }).refine((f) => ({
  //   bookSeries: {
  //     columns: {
  //       title: f.loremIpsum(),
  //     },
  //   },
  // }));

  // await seed(db, { books: schema.booksTable }).refine((f) => ({
  //   books: {
  //     columns: {
  //       title: f.companyName({}),
  //       description: f.loremIpsum({ sentencesCount: 2,}),
  //       rating: f.number({ minValue: 0, maxValue: 10, precision: 100 }), // 0–5 с двумя знаками после запятой
  //       languageCode: f.valuesFromArray({ values: languageCodes }),
  //       publishedDate: f.date({ minDate: "1900-01-01", maxDate: "2025-05-11" }),
  //       publisher: f.valuesFromArray({ values: publishers }),
  //       pageCount: f.int({ minValue: 50, maxValue: 1000 }),
  //       seriesIndex: f.int({ minValue: 0, maxValue: 10 }),
  //       bookSeriesId: f.int({ minValue: 1, maxValue: 10 }), // Предполагается, что 10 серий уже созданы
  //       totalReviews: f.int({ minValue: 0, maxValue: 100 }),
  //       averageRating: f.number({ minValue: 0, maxValue: 10, precision: 100 }),
  //       isbn: f.string({ isUnique: true }),
  //       slug: f.string({ isUnique: true }),

  //       coverUrl: f.default({
  //         defaultValue: `https://picsum.photos/seed/book${Math.floor(Math.random() * 1000)}/200/300`,
  //       }),
  //       previewUrl: f.default({ defaultValue: "https://example.com/previews/default.pdf" }),
  //       downloadUrl: f.default({ defaultValue: "https://example.com/downloads/default.pdf" }),
  //     },
  //     count: 20,
  //   },
  // }));

  // await seed(db, { bookToGenres: schema.booksToGenresTable }).refine((f) => ({
  //   bookToGenres: {
  //     columns: {
  //       bookId: f.int({ minValue: 1, maxValue: 20 }),
  //       genreId: f.int({ minValue: 1, maxValue: 10 }),
  //     count: 20,
  //   },
  // }}));

  // await seed(db, { booksToAuthors: schema.booksToAuthorsTable }).refine((f) => ({
  //   booksToAuthors: {
  //     columns: {
  //       bookId: f.int({ minValue: 1, maxValue: 20, isUnique: true }),
  //       authorId: f.int({ minValue: 1, maxValue: 10, isUnique: true }),
  //     },
  //     count: 10,
  //   }
  // }));
};
