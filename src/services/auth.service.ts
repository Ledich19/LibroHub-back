import jwt from "jsonwebtoken";
import db from "../db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
const JWT_SECRET = process.env.JWT_SECRET ?? "secret";

export const createToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET);
};

export const registerUser = async (email: string, password: string, name: string) => {
  const hashedPassword = await hash(password, 10);
  const user = {
    name,
    email,
    passwordHash: hashedPassword,
  };

  const [createdUser] = await db
    .insert(usersTable)
    .values(user)
    .returning();

  const token = createToken(createdUser.id);
  return { token, user: createdUser };
};

export const loginUser = async (email: string, password: string) => {
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, email),
  });

  if (!user) throw new Error("User not found");

  const valid = await compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid password");

  const token = createToken(user.id);
  return { token, user };
};
