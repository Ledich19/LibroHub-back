import { inArray } from "drizzle-orm";
import {
  authorsTable,
  booksTable,
  booksToAuthorsTable,
} from "../../../db/schema";
import { DbAuthor } from "../../../db/types/author";
import { Context } from "../../types";
import { DbBook } from "../../../db/types/books";

export const authorsLoader = async (
  ids: number[],
  ctx: Context
): Promise<readonly (DbAuthor | Error)[]> => {
  console.log("📦 Loading authors loader works: ", ids);
  const authors = (await ctx.db
    .select()
    .from(authorsTable)
    .where(inArray(authorsTable.id, ids))) as DbAuthor[];
  const authorMap = new Map(
    authors.map((author: DbAuthor) => [author.id, author])
  );
  return ids.map(
    (id) => authorMap.get(id) || new Error(`Author not found: ${id}`)
  );
};

export const booksByAuthorLoader = async (
  authorIds: number[],
  ctx: Context
): Promise<readonly DbBook[][]> => {
  ctx.log.debug("📦 Loading books by author IDs:", authorIds);

  const booksToAuthors = await ctx.db
    .select()
    .from(booksToAuthorsTable)
    .where(inArray(booksToAuthorsTable.authorId, authorIds));

  const bookIds = booksToAuthors.map((link) => link.bookId);
  const books = await ctx.db
    .select()
    .from(booksTable)
    .where(inArray(booksTable.id, bookIds));

  // Сопоставление bookId → Book
  const bookMap = new Map<number, DbBook>();
  for (const book of books) {
    bookMap.set(book.id, book);
  }

  // Сопоставление authorId → DbBook[]
  const authorToBooks = new Map<number, DbBook[]>();
  for (const link of booksToAuthors) {
    if (!authorToBooks.has(link.authorId)) {
      authorToBooks.set(link.authorId, []);
    }
    const book = bookMap.get(link.bookId);
    if (book) {
      authorToBooks.get(link.authorId)!.push(book);
    }
  }

  // Возвращаем в том же порядке, что и входной authorIds
  return authorIds.map((authorId) => authorToBooks.get(authorId) || []);
};
