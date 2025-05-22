import { builder } from "../../builder";
import {
  booksTable,
  booksToAuthorsTable,
  booksToGenresTable,
} from "../../../db/schema";
import { GqlBook } from "./book.type";
import { BOOK_FILTER_KEYS } from "../filters/bookFilters.type";
import { and, between, eq, exists, ilike, inArray, like } from "drizzle-orm";

const RangeInput = builder.inputType("RangeInput", {
  fields: (t) => ({
    min: t.int({ required: true }),
    max: t.int({ required: true }),
  }),
});

builder.queryFields((t) => ({
  book: t.field({
    type: GqlBook,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (parent, args, ctx) => {
      return args.id;
    },
  }),

  books: t.field({
    type: [GqlBook],
    args: {
      limit: t.arg.int({ defaultValue: 10 }),
      offset: t.arg.int({ defaultValue: 0 }),
      [BOOK_FILTER_KEYS.SEARCH]: t.arg.string(),
      [BOOK_FILTER_KEYS.GENRES]: t.arg.intList(),
      [BOOK_FILTER_KEYS.TAGS]: t.arg.intList(),
      [BOOK_FILTER_KEYS.AUTHORS]: t.arg.intList(),
      [BOOK_FILTER_KEYS.SERIES]: t.arg.intList(),
      [BOOK_FILTER_KEYS.LANGUAGE]: t.arg.stringList(),
      [BOOK_FILTER_KEYS.RATING]: t.arg({ type: RangeInput }),
      [BOOK_FILTER_KEYS.YEAR]: t.arg({ type: RangeInput }),
      [BOOK_FILTER_KEYS.PAGES]: t.arg.int(),
      [BOOK_FILTER_KEYS.SORT_BY]: t.arg.string(),
    },
    resolve: async (parent, args, ctx) => {
      const {
        limit = 10,
        offset = 0,
        [BOOK_FILTER_KEYS.SEARCH]: search,
        [BOOK_FILTER_KEYS.GENRES]: genres,
        [BOOK_FILTER_KEYS.TAGS]: tags,
        [BOOK_FILTER_KEYS.AUTHORS]: authors,
        [BOOK_FILTER_KEYS.SERIES]: series,
        [BOOK_FILTER_KEYS.LANGUAGE]: language,
        [BOOK_FILTER_KEYS.RATING]: rating,
        [BOOK_FILTER_KEYS.YEAR]: year,
        [BOOK_FILTER_KEYS.PAGES]: pages,
        [BOOK_FILTER_KEYS.SORT_BY]: sortBy,
      } = args;

      const conditions = [];

      if (search) conditions.push(like(booksTable.title, `%${search}%`));
      if (series?.length) conditions.push(inArray(booksTable.seriesId, series));
      if (language?.length)
        conditions.push(inArray(booksTable.languageCode, language));
      if (rating?.min != null && rating?.max != null)
        conditions.push(between(booksTable.rating, rating.min, rating.max));
      if (year?.min != null && year?.max != null) {
        const minDate = `${year.min}-01-01`;
        const maxDate = `${year.max}-12-31`;
        conditions.push(between(booksTable.publishedDate, minDate, maxDate));
      }
      if (pages != null) conditions.push(eq(booksTable.pageCount, pages));
      if (genres?.length) {
        conditions.push(
          exists(
            ctx.db
              .select()
              .from(booksToGenresTable)
              .where(
                and(
                  eq(booksToGenresTable.bookId, booksTable.id),
                  inArray(booksToGenresTable.genreId, genres)
                )
              )
          )
        );
      }
      if (authors?.length) {
        conditions.push(
          exists(
            ctx.db
              .select()
              .from(booksToAuthorsTable)
              .where(
                and(
                  eq(booksToAuthorsTable.bookId, booksTable.id),
                  inArray(booksToAuthorsTable.authorId, authors)
                )
              )
          )
        );
      }

      let queryBuilder = ctx.db
        .select()
        .from(booksTable)
        .where(and(...conditions))
        .limit(limit ?? 10)
        .offset(offset ?? 0);

      return await queryBuilder;
    },
  }),
}));
