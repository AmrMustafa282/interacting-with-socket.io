import { db } from "./db";

export const getRooms = async () => {
 return db.query("SELECT * FROM rooms");
};

export const createRoom = async (name: string) => {
 return db.query("INSERT INTO rooms (name) VALUES ($1) RETURNING *", [name]);
};

export const getRoom = async (name: string) => {
 const result = await db.query("SELECT * FROM rooms WHERE name = $1", [name]);
 return result.rows[0];
};

