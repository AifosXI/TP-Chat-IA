"use client";

import React, {useEffect, useState} from "react";
import { io } from "socket.io-client";
import SendMessage from "@/components/chat/SendMessage";
import Messages from "@/components/chat/Messages";
import SendUsername from "@/components/chat/SendUsername";

const socket = io("http://localhost:3000");
const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

export default function Home() {

  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");

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


  // --------------------- REPLICATE IA ---------------------
  const [prediction, setPrediction] = useState([]);
  const [predictionStatus, setPredictionStatus] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `translate this  in ${language} : ${messages[1].content}`,
      }),
    });

    let prediction = await response.json();

    if(prediction.status !== 201)
    {
      setError(prediction.response);
    }

    setPrediction(prediction);

    while (
        prediction.response.status !== "succeeded" &&
        prediction.response.status !== "failed"
        ) {
      await sleep(1000);

      const response = await fetch("/api/predictions/" + prediction.response.id);

      prediction = await response.json();

      if (response.status !== 200) {
        setError(prediction.detail);
      }

      setPrediction(prediction.response.output);
    }

    setPredictionStatus("succeeded");
  }

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

        <form onSubmit={handleSubmit} className={"flex flex-row justify-between gap-x-4 w-full mt-4"}>
          <input type={"text"} className={"py-2 px-4 text-black rounded-2xl w-full"} placeholder={"Language"}
                 value={language} onChange={(e) => setLanguage(e.target.value)}/>
          <button type={"submit"} className={"rounded-2xl border border-white py-2 px-4"}>Submit</button>
        </form>
        {error && <p className={"text-red-500 mt-4"}>Une erreur est survenue pendant la traduction : {error}</p>}

        {predictionStatus === "succeeded" && <p>{prediction.join("")}</p>}

      </main>
  )
}
