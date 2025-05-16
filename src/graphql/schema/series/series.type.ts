import { DbSeries } from "../../../db/types/books_serias";
import { builder } from "../../builder";
import {  GqlBook } from "../books";
import { GqlAuthor } from "../author/author.type";
import {  authorsBySeriesIdLoader, booksBySeriesLoader, seriesLoader } from "./series.loader";

export const GqlSeries = builder.loadableObjectRef<DbSeries, number>("series", {
  load: seriesLoader,
});
GqlSeries.implement({
  fields: (t) => ({
    id: t.exposeID("id", {}),
    title: t.exposeString("title"),
    slug: t.exposeString("slug"),
    description: t.exposeString("description", { nullable: true }),
    coverUrl: t.exposeString("coverUrl", { nullable: true }),
    rating: t.exposeFloat("rating"),
    averageRating: t.exposeFloat("averageRating"),
    isPublished: t.exposeBoolean("isPublished"),
    isVerified: t.exposeBoolean("isVerified"),
    createdAt: t.expose("createdAt", { type: "Date" }),
    updatedAt: t.expose("updatedAt", { type: "Date" }),

    books: t.loadableList({
      type: GqlBook,
      nullable: true,
      load: booksBySeriesLoader,
      resolve: async (series, args, ctx) => {
        return series.id;
      },
    }),

    authors: t.loadableList({
      type: GqlAuthor,
      nullable: true,
      load: authorsBySeriesIdLoader,
      resolve: async (series, args, ctx) => {
        return series.id;
      },
    }),
  }),
});
