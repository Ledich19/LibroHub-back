import db from "../db";

export interface Context {
  db: typeof db;
  userId?: number;
}