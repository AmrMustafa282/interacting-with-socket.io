import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "./ui/button";
import { X } from "lucide-react";

import {
 ContextMenu,
 ContextMenuCheckboxItem,
 ContextMenuContent,
 ContextMenuItem,
 ContextMenuLabel,
 ContextMenuRadioGroup,
 ContextMenuRadioItem,
 ContextMenuSeparator,
 ContextMenuShortcut,
 ContextMenuSub,
 ContextMenuSubContent,
 ContextMenuSubTrigger,
 ContextMenuTrigger,
} from "./../components/ui/context-menu";

const socket: Socket = io("http://localhost:4000");

interface Message {
 id: number;
 content: string;
 authorid: number;
 replyto?: number;
}

const Chat: React.FC<{ room: string }> = ({ room }) => {
 const user = JSON.parse(localStorage.getItem("user") || "{}");
 const [message, setMessage] = useState("");
 const [messages, setMessages] = useState<Message[]>([]);
 const [replyto, setReplyto] = useState<number | null>(null);
 const messageContainerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  console.log("Connecting to socket...");
  socket.on("connect", () => {
   console.log("Socket connected:", socket.id);
  });

  socket.emit("join_room", { room, token: localStorage.getItem("token") });

  socket.on("receive_message", (msg: Message) => {
   setMessages((prev) => [...prev, msg]);
  });

  socket.on("previous_messages", (msgs: Message[]) => {
   setMessages(msgs);
  });

  return () => {
   socket.off("receive_message");
   socket.off("previous_messages");
   //  socket.disconnect();
  };
 }, [room]);

 useEffect(() => {
  if (messageContainerRef.current) {
   messageContainerRef.current.scrollTop =
    messageContainerRef.current.scrollHeight;
  }
 }, [messages]);

 const sendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (message.trim() === "") {
   console.warn("Message cannot be empty");
   return;
  }

  socket.emit("send_message", {
   content: message,
   room,
   token: localStorage.getItem("token"),
   replyto,
  });
  setMessage("");
  setReplyto(null);
 };

 return (
  <div className="px-4 flex flex-col h-full gap-4 max-h-full">
   {/* <h2>Room: {room}</h2> */}
   <div
    ref={messageContainerRef}
    className=" flex-grow   overflow-y-auto p-4 border rounded-md "
   >
    {messages?.map((msg) => (
     <ContextMenu>
      <ContextMenuTrigger className="">
       <div
        key={msg.id}
        style={{
         marginBottom: "10px",
         textAlign: user?.id === msg.authorid ? "right" : "left",
        }}
       >
        <p
         style={{
          color: user?.id === msg.authorid ? "#62fc10" : "#b2b2b2",
          background: user?.id === msg.authorid ? "#e0ffe0" : "#f0f0f0",
          padding: "10px",
          borderRadius: "10px",
          display: "inline-block",
          maxWidth: "70%",
         }}
        >
         {msg.replyto && (
          <p
           style={{ fontSize: "0.8em", color: "#888" }}
           className="w-fit px-2 py-1 rounded-sm bg-white/40 border  border-l-4 border-l-blue-300"
          >
           {messages.find((m) => m.id === msg.replyto)?.content}
          </p>
         )}
         <span>{msg.content}</span>
        </p>
       </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
       <ContextMenuItem
        inset
        onClick={() => {
         replyto === msg.id ? setReplyto(null) : setReplyto(msg.id);
        }}
       >
        {replyto === msg.id ? "Remove" : "Reply"}
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
       </ContextMenuItem>
       <ContextMenuItem inset disabled>
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
       </ContextMenuItem>
       <ContextMenuItem inset>
        Reload
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
       </ContextMenuItem>
       <ContextMenuSub>
        <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
         <ContextMenuItem>
          Save Page As...
          <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
         </ContextMenuItem>
         <ContextMenuItem>Create Shortcut...</ContextMenuItem>
         <ContextMenuItem>Name Window...</ContextMenuItem>
         <ContextMenuSeparator />
         <ContextMenuItem>Developer Tools</ContextMenuItem>
        </ContextMenuSubContent>
       </ContextMenuSub>
       <ContextMenuSeparator />
       <ContextMenuCheckboxItem checked>
        Show Bookmarks Bar
        <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
       </ContextMenuCheckboxItem>
       <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
       <ContextMenuSeparator />
       <ContextMenuRadioGroup value="pedro">
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
       </ContextMenuRadioGroup>
      </ContextMenuContent>
     </ContextMenu>
    ))}
   </div>
   <form className="mt-auto" onSubmit={sendMessage}>
    <div className="  space-y-3 ">
     {replyto && (
      <div>
       <p className="flex gap-2 items-center bg-[#f0f0f0] text-[#b2b2b2] pl-4 pr-1 py-2  rounded-md w-fit">
        {messages.find((m) => m.id === replyto)?.content}
        <Button
         type="button"
         variant={"ghost"}
         size={"icon"}
         onClick={() => setReplyto(null)}
        >
         <X />
        </Button>
       </p>
      </div>
     )}
     <div className="relative">
      <input
       value={message}
       onChange={(e) => setMessage(e.target.value)}
       placeholder="Type your message..."
       style={{
        width: "calc(100%)",
        padding: "10px ",
        borderRadius: "5px",
        border: "1px solid #ccc",
        //  marginBottom: "10px",
       }}
      />
      <Button
       className="absolute right-2 top-[50%]  -translate-y-[50%]   "
       type="submit"
      >
       Send
      </Button>
     </div>
    </div>
   </form>
  </div>
 );
};

export default Chat;
