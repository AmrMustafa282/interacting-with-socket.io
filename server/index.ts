import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { db } from "./db";
import { registerUser, loginUser, authenticate } from "./auth";
import cors from "cors";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
 cors: {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST"],
 },
});

app.use(express.json());
app.use(cors());

const PORT = 4000;

// User registration endpoint
app.post("/api/register", async (req, res) => {
 try {
  const user = await registerUser(req.body.username, req.body.password);
  res.status(201).json(user);
 } catch (err: any) {
  res.status(400).json({ error: err.message });
 }
});

// User login endpoint
app.post("/api/login", async (req, res) => {
 try {
  const { token, user } = await loginUser(req.body.username, req.body.password);
  res.json({ token, user });
 } catch (err: any) {
  res.status(401).json({ error: err.message });
 }
});

app.get("/api/rooms", async (req, res) => {
 try {
  const rooms = await db.query("SELECT * FROM rooms");
  res.json(rooms.rows);
 } catch (err: any) {
  res.status(500).json({ error: err.message });
 }
});

app.post("/api/rooms", async (req, res) => {
 try {
  const room = await db.query(
   "INSERT INTO rooms (name) VALUES ($1) RETURNING *",
   [req.body.name]
  );
  res.status(201).json(room.rows[0]);
 } catch (err: any) {
  res.status(400).json({ error: err.message });
 }
});
// Socket.IO connection and events
io.on("connection", (socket: Socket) => {
 console.log(`User connected: ${socket.id}`);

 socket.on("join_room", async ({ room, token }) => {
  try {
   const { userId } = authenticate(token);
   const roomData = await db.query("SELECT * FROM rooms WHERE name = $1", [
    room,
   ]);

   // Create room if it doesn't exist
   if (!roomData.rows[0]) {
    await db.query("INSERT INTO rooms (name) VALUES ($1)", [room]);
   }

   // Join the room
   socket.join(room);
   console.log(`User ${userId} joined room: ${room}`);

   // Fetch previous messages for the room
   const messagesData = await db.query(
    "SELECT m.id, m.content, m.author_id AS authorId, m.reply_to AS replyto FROM messages m JOIN rooms r ON m.room_id = r.id WHERE r.name = $1",
    [room]
   );
   //  console.log(messagesData.rows);

   // Emit previous messages to the client
   socket.emit("previous_messages", messagesData.rows);
  } catch (err: any) {
   console.error("Authentication error:", err.message);
  }
 });

 socket.on("send_message", async ({ content, room, token, replyto }) => {
  // console.log(`User ${socket.id} sent message: ${content}`);
  try {
   const { userId } = authenticate(token);
   const roomData = await db.query("SELECT id FROM rooms WHERE name = $1", [
    room,
   ]);
   const roomId = roomData.rows[0].id;

   const newMessage = await db.query(
    "INSERT INTO messages (room_id, author_id, content, reply_to) VALUES ($1, $2, $3, $4) RETURNING id",
    [roomId, userId, content, replyto]
   );

   io.to(room).emit("receive_message", {
    id: newMessage.rows[0].id,
    content,
    authorid: userId,
    replyto,
   });
  } catch (err: any) {
   console.error("Error sending message:", err.message);
  }
 });

 socket.on("disconnect", () => {
  console.log(`User disconnected: ${socket.id}`);
 });
});

httpServer.listen(PORT, () =>
 console.log(`Server running on http://localhost:${PORT}`)
);
