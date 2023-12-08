"use client";

import React, {useEffect, useState} from "react";
import { io } from "socket.io-client";
import SendMessage from "@/components/chat/SendMessage";
import Messages from "@/components/chat/Messages";
import SendUsername from "@/components/chat/SendUsername";
import SetLanguage from "@/components/chat/SetLanguage";
import GenerateTwoResponse from "@/components/chat/GenerateTwoResponse";

const socket = io("http://localhost:3000");

export default function Home() {

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const [lastMessage, setLastMessage] = useState("");

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

    socket.on("send-last-message", (data) => {
      if(data.username === username)
      {
      } else {
        setLastMessage(data[0].content);
      }
    })
  }, []);

  return (
      <main className="flex min-h-screen flex-col items-center p-24 max-w-screen-xl mx-auto">
        <h1 className={"font-bold uppercase text-3xl"}> TP Chat Socket.io NestJS & NextJS </h1>

        <div className={"flex flex-col items-center w-full mt-20"}>

          <SendUsername socket={socket} setUsername={setUsername}/>

          <div className={"flex flex-col bg-teal-900 p-4 w-full rounded-md"}>
            <Messages messages={messages} username={username} language={language}/>
          </div>

          <GenerateTwoResponse message={lastMessage} socket={socket} username={username}/>
          <SendMessage socket={socket} username={username}/>

          <div className={"w-full mt-4 flex flex-row items-center gap-x-4"}>
            <p>If you want to translate the messages, please enter a language here</p>
            <SetLanguage setLanguage={setLanguage}/>
          </div>
          <p className={"w-full"}>Selected language : {language}</p>
        </div>

      </main>
  )
}
