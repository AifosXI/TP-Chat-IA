"use client";

import {useEffect, useState} from "react";
import { io } from "socket.io-client";
import SendMessage from "@/components/chat/SendMessage";
import Messages from "@/components/chat/Messages";
import SendUsername from "@/components/chat/SendUsername";

const socket = io("http://localhost:3000");

export default function Home() {

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });

    socket.on("send-message", (data) => {
      setMessages((msg) => [...msg, data] as any);
    });

    socket.once("send-old-messages", (data) => {
      setMessages((msg) => [msg, ...data] as any);
    });

  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24 max-w-screen-xl mx-auto">
      <h1 className={"font-bold uppercase text-3xl"}> TP Chat Socket.io NestJS & NextJS </h1>

      <div className={"flex flex-col items-center w-full mt-20"}>
        <div className={"flex flex-col bg-teal-900 p-4 w-full rounded-md"}>
          <Messages messages={messages} username={username}/>
        </div>
        <div className={"flex flex-col gap-x-4 w-full"}>
          <SendUsername socket={socket} setUsername={setUsername}/>
          <SendMessage socket={socket} username={username}/>
        </div>
      </div>
    </main>
  )
}
