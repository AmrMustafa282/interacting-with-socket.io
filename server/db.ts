import { Pool } from "pg";

export const db = new Pool({
 user: "postgres",
 host: "localhost",
 database: "socket_chat",
 password: "root",
 port: 5432,
});
