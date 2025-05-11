import { builder } from "../../builder";
import { DbBook } from "../../../db/types/books";

import { GqlAuthor } from "../author/author";
import { authorsTable, booksToAuthorsTable } from "../../../db/schema";
import { eq, inArray } from "drizzle-orm";
import { GqlLanguage } from "../language/language";

export const GqlBook = builder.objectRef<DbBook>("Book");
GqlBook.implement({
  fields: (t) => ({
    id: t.exposeID("id"),
    title: t.exposeString("title"),
    description: t.exposeString("description"),
    rating: t.exposeFloat("rating"),
    languageCode: t.exposeString("languageCode"),
    publishedDate: t.exposeString("publishedDate"),
    publisher: t.exposeString("publisher"),
    pageCount: t.exposeInt("pageCount"),
    seriesIndex: t.exposeInt("seriesIndex"),
    bookSeriesId: t.exposeInt("bookSeriesId"),
    totalReviews: t.exposeInt("totalReviews"),
    averageRating: t.exposeFloat("averageRating"),
    isbn: t.exposeString("isbn"),
    slug: t.exposeString("slug"),
    coverUrl: t.exposeString("coverUrl"),
    previewUrl: t.exposeString("previewUrl"),
    downloadUrl: t.exposeString("downloadUrl"),

    language: t.field({
      type: GqlLanguage,
      nullable: true,
      resolve: async (book, args, ctx) => {
        if (!book.languageCode) return null;
    
        return ctx.db.query.languagesTable.findFirst({
          where: (fields, { eq }) => eq(fields.code, book.languageCode as string),
        });
      },
    }),
    
    
    authors: t.field({
      type: [GqlAuthor],
      resolve: async (book, args, ctx) => {
        const links = await ctx.db
          .select()
          .from(booksToAuthorsTable)
          .where(eq(booksToAuthorsTable.bookId, book.id));

        const authorIds = links.map(link => link.authorId);

        if (authorIds.length === 0) return [];

        return ctx.db
          .select()
          .from(authorsTable)
          .where(inArray(authorsTable.id, authorIds));
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
      return ctx.db.query.booksTable.findFirst({
        where: (fields, { eq }) => eq(fields.id, args.id),
      });
    },
  }),
  books: t.field({
    type: [GqlBook],
    resolve: async (parent, args, ctx) => {
      return ctx.db.query.booksTable.findMany();
    },
  }),
}));