import { builder } from "../../builder";
import { DbBook } from "../../../db/types/books";
import { GqlAuthor } from "../author/author.type";
import { GqlLanguage } from "../language/language.type";

import { bookLoader, authorsByBooksIdLoader} from "./book.loader";
import { languageLoader } from "../language/language.loader";
import { GqlSeries } from "../series/series.type";


export const GqlBook = builder
  .loadableObjectRef<DbBook, number>("Book", {
    load: bookLoader,
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
      seriesId: t.exposeInt("seriesId", { nullable: true }),
      totalReviews: t.exposeInt("totalReviews"),
      isbn: t.exposeString("isbn", { nullable: true }),
      slug: t.exposeString("slug"),
      coverUrl: t.exposeString("coverUrl", { nullable: true }),
      previewUrl: t.exposeString("previewUrl", { nullable: true }),
      downloadUrl: t.exposeString("downloadUrl", { nullable: true }),

      series: t.field({
        type: GqlSeries,
        nullable: true,
        resolve: async (book, args, ctx) => {
          if (!book.seriesId) return null;
          return ctx.db.query.seriesTable.findFirst({
            where: (fields, { eq }) =>
              eq(fields.id, book.seriesId as number),
          });
        },
      }),

      language: t.loadable({
        type: GqlLanguage,
        nullable: true,
        load: languageLoader,
        resolve: (book) => book.languageCode,
      }),

      authors: t.loadableList({
        type: GqlAuthor,
        load: authorsByBooksIdLoader,
        resolve: (book) => book.id,
      }),
    }),
  });
