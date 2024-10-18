import { useEffect, useState } from "react";
import Chat from "../components/Chat";
import RoomList from "../components/RoomList";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
 ResizableHandle,
 ResizablePanel,
 ResizablePanelGroup,
} from "../components/ui/resizable";

export interface Room {
 id: number;
 name: string;
}

export default function HomePage() {
 const [room, setRoom] = useState<string | null>(null);
 const [rooms, setRooms] = useState<Room[]>([]);
 const [isLoading, setIsLoading] = useState(false);
 const { user } = useAuth();

 useEffect(() => {
  const fetchRooms = async () => {
   try {
    const res = await axios.get("/api/rooms");
    // console.log(res);
    setRooms(res.data);
    setRoom(res.data[0].name);
   } catch (error) {
    console.error(error);
   } finally {
    setIsLoading(false);
   }
  };
  fetchRooms();
 }, []);

 if (!user) return <p>Please log in to see available rooms.</p>;
 if (isLoading) return <p>Loading...</p>;

 //  console.log(rooms);

 return (
  <div className="flex gap-x-1 h-full">
   {rooms.length === 0 ? (
    <p>No rooms available</p>
   ) : (
    <>
     <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} className="border bordre-[#ccc]">
       <RoomList onJoin={setRoom} rooms={rooms} setRooms={setRooms} />
      </ResizablePanel>
      <ResizableHandle withHandle className="border-none  bg-transparent" />
      <ResizablePanel defaultSize={75} className="flex-grow overflow-hidden ">
       <Chat room={room || ""} />
      </ResizablePanel>
     </ResizablePanelGroup>
    </>
   )}
  </div>
 );
}
