import React, { useState } from "react";
import axios from "../utils/axiosInstance";

import { Room } from "../pages/HomePage";

const RoomList: React.FC<{
 onJoin: (room: string) => void;
 rooms: Room[];
 setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
}> = ({ onJoin, rooms, setRooms }) => {
 const [newRoom, setNewRoom] = useState("");

 const createRoom = async () => {
  const res = await axios.post("/rooms", { name: newRoom });
  if (res.status === 200) setRooms((prev) => [...prev, res.data]);
 };
 return (
  <div>
   {rooms.length === 0 ? (
    <p>No rooms available</p>
   ) : (
    <ul className="flex flex-col gap-2 p-2  ">
     {rooms?.map((room) => (
      <li
       className="cursor-pointer bg-gray-100 px-2 py-3 rounded-md"
       key={room.id}
       onClick={() => {
        onJoin(room.name);
       }}
      >
       {room.name}
      </li>
     ))}
    </ul>
   )}
   {/* <h2>Create Room</h2>
   <input
    type="text"
    placeholder="Room name..."
    value={newRoom}
    onChange={(e) => setNewRoom(e.target.value)}
   />
   <button onClick={createRoom}>Create</button> */}
  </div>
 );
};

export default RoomList;
