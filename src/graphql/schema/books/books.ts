import { builder } from "../../builder";
import { DbBook } from "../../../db/types/books";

import { GqlAuthor } from "../author/author";
import {
  authorsTable,
  booksTable,
  booksToAuthorsTable,
} from "../../../db/schema";
import { eq, inArray } from "drizzle-orm";
import { GqlLanguage } from "../language/language";
import { GqlBookSeries } from "../bookSeries/bookSeries";
import { DbAuthor } from "../../../db/types/author";

export const GqlBook = builder
  .loadableObjectRef<DbBook, number>("Book", {
    load: async (ids: number[], ctx): Promise<readonly (DbBook | Error)[]> => {
      ctx.log.debug("📦 Loading books in batch:", ids);
      const books = (await ctx.db
        .select()
        .from(booksTable)
        .where(inArray(booksTable.id, ids))) as DbBook[];
      const bookMap = new Map(books.map((book: DbBook) => [book.id, book]));
      return ids.map(
        (id) => bookMap.get(id) || new Error(`Book not found: ${id}`)
      );
    },
  })
  .implement({
    fields: (t) => ({
      id: t.exposeID("id", {}),
      title: t.exposeString("title"),
      description: t.exposeString("description", { nullable: true }),
      rating: t.exposeFloat("rating"),
      languageCode: t.exposeString("languageCode", { nullable: true }),
      publishedDate: t.exposeString("publishedDate", { nullable: true }),
      publisher: t.exposeString("publisher", { nullable: true }),
      pageCount: t.exposeInt("pageCount", { nullable: true }),
      seriesIndex: t.exposeInt("seriesIndex", { nullable: true }),
      bookSeriesId: t.exposeInt("bookSeriesId", { nullable: true }),
      totalReviews: t.exposeInt("totalReviews"),
      isbn: t.exposeString("isbn", { nullable: true }),
      slug: t.exposeString("slug"),
      coverUrl: t.exposeString("coverUrl", { nullable: true }),
      previewUrl: t.exposeString("previewUrl", { nullable: true }),
      downloadUrl: t.exposeString("downloadUrl", { nullable: true }),

      series: t.field({
        type: GqlBookSeries,
        nullable: true,
        resolve: async (book, args, ctx) => {
          if (!book.bookSeriesId) return null;

          return ctx.db.query.booksSeriesTable.findFirst({
            where: (fields, { eq }) =>
              eq(fields.id, book.bookSeriesId as number),
          });
        },
      }),

      // language: t.field({
      //   type: GqlLanguage,
      //   nullable: true,
      //   resolve: async (book, args, ctx) => {
      //     if (!book.languageCode) return null;

      //     return ctx.db.query.languagesTable.findFirst({
      //       where: (fields, { eq }) => eq(fields.code, book.languageCode ?? ""),
      //     });
      //   },
      // }),
      language: t.loadable({
        type: GqlLanguage,
        nullable: true,
        load: async (books: string[], ctx) => {
          return ctx.db.query.languagesTable.findMany({
            where: (fields, { inArray }) => inArray(fields.code, books),
          });
        },
        resolve: (book) => book.languageCode,
      }),

      authors: t.loadableList({
        type: GqlAuthor,
        load: async (
          ids: number[],
          ctx
        ): Promise<readonly (DbAuthor[] | Error)[]> => {
          ctx.log.debug("📚 Loading authors for books:", ids);

          const links = await ctx.db
            .select()
            .from(booksToAuthorsTable)
            .where(inArray(booksToAuthorsTable.bookId, ids));

          const authorIds = links.map((link) => link.authorId);
          const authors = (await ctx.db
            .select()
            .from(authorsTable)
            .where(inArray(authorsTable.id, authorIds))) as DbAuthor[];

          const authorMap = new Map(authors.map((a) => [a.id, a]));
          return ids.map((bookId) => {
            const relatedAuthorIds = links
              .filter((link) => link.bookId === bookId)
              .map((link) => link.authorId);

            const authorsForBook = relatedAuthorIds
              .map((id) => authorMap.get(id))
              .filter((a): a is DbAuthor => !!a);

            return authorsForBook;
          });
        },

        resolve: async (author, args) => {
          return author.id;
        },
      }),
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
    },
    resolve: async (parent, { limit, offset }, ctx) => {
      const safeLimit = limit ?? 10;
      const safeOffset = offset ?? 0;
      const books = await ctx.db
        .select()
        .from(booksTable)
        .limit(safeLimit)
        .offset(safeOffset);

      return books.map((b) => b.id);
    },
  }),
}));
