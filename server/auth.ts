import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";

const JWT_SECRET = "your_jwt_secret";

export const registerUser = async (username: string, password: string) => {
 const hashedPassword = await bcrypt.hash(password, 10);
 const result = await db.query(
  "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *",
  [username, hashedPassword]
 );
 return result.rows[0];
};

export const loginUser = async (username: string, password: string) => {
 const result = await db.query("SELECT * FROM users WHERE username = $1", [
  username,
 ]);
 const user = result.rows[0];
 if (!user || !(await bcrypt.compare(password, user.password_hash))) {
  throw new Error("Invalid credentials");
 }
 const token = jwt.sign(
  { userId: user.id, username: user.username },
  JWT_SECRET,
  { expiresIn: "1h" }
 );
 return { token, user };
};

export const authenticate = (token: string) => {
 try {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
 } catch {
  throw new Error("Invalid token");
 }
};
