import { inArray } from "drizzle-orm";
import {
  authorsTable,
  booksTable,
  booksToAuthorsTable,
} from "../../../db/schema";
import { DbBook } from "../../../db/types/books";
import { DbAuthor } from "../../../db/types/author";
import { Context } from "../../types";

export const bookLoader = async (
  ids: number[],
  ctx: any
): Promise<readonly (DbBook | Error)[]> => {
  ctx.log.debug("📦 Loading books in batch:", ids);
  const books = (await ctx.db
    .select()
    .from(booksTable)
    .where(inArray(booksTable.id, ids))) as DbBook[];
  const bookMap = new Map(books.map((book: DbBook) => [book.id, book]));
  return ids.map((id) => bookMap.get(id) || new Error(`Book not found: ${id}`));
};

export const authorsByBooksIdLoader = async (
  ids: number[],
  ctx: Context
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
};



