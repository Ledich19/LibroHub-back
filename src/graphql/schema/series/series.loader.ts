import { inArray } from "drizzle-orm";
import {
  authorsTable,
  booksTable,
  seriesTable,
  seriesToAuthorsTable,
} from "../../../db/schema";
import { DbSeries } from "../../../db/types/books_serias";
import { Context } from "../../types";
import { DbBook } from "../../../db/types/books";
import { DbAuthor } from "../../../db/types/author";

export const seriesLoader = async (
  ids: number[],
  ctx: Context
): Promise<readonly (DbSeries | Error)[]> => {
  console.log("📦 Loading series loader works: ", ids);
  const series = (await ctx.db
    .select()
    .from(seriesTable)
    .where(inArray(seriesTable.id, ids))) as DbSeries[];
  const seriesMap = new Map(
    series.map((series: DbSeries) => [series.id, series])
  );
  return ids.map(
    (id) => seriesMap.get(id) || new Error(`Series not found: ${id}`)
  );
};

export const booksBySeriesLoader = async (
  seriesIds: number[],
  ctx: Context
): Promise<readonly (readonly DbBook[] | Error | null)[]> => {
  ctx.log.debug("📦 Loading books by series IDs:", seriesIds);

  const books = await ctx.db
    .select()
    .from(booksTable)
    .where(inArray(booksTable.seriesId, seriesIds));

  const grouped = new Map<number, DbBook[]>();

  for (const book of books) {
    if (!book.seriesId) {
      continue;
    }
    if (!grouped.has(book.seriesId)) {
      grouped.set(book.seriesId, []);
    }
    grouped.get(book.seriesId)!.push(book);
  }

  return seriesIds.map((id) => grouped.get(id) ?? []);
};

export const authorsBySeriesIdLoader = async (
  ids: number[],
  ctx: Context
): Promise<readonly (DbAuthor[] | Error)[]> => {
  ctx.log.debug("📚 Loading authors for series:", ids);

  const seriesToAuthors = await ctx.db
    .select()
    .from(seriesToAuthorsTable)
    .where(inArray(seriesToAuthorsTable.seriesId, ids));

  const authorIds = seriesToAuthors.map((link) => link.authorId);
  const authors = (await ctx.db
    .select()
    .from(authorsTable)
    .where(inArray(authorsTable.id, authorIds))) as DbAuthor[];

  const authorMap = new Map(authors.map((a) => [a.id, a]));
  return ids.map((seriesId) => {
    const relatedAuthorIds = seriesToAuthors
      .filter((link) => link.seriesId === seriesId)
      .map((link) => link.authorId);

    const authorsForSeries = relatedAuthorIds
      .map((id) => authorMap.get(id))
      .filter((a): a is DbAuthor => !!a);

    return authorsForSeries;
  });
};
