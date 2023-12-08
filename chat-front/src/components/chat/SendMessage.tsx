"use client";

import { Socket } from "socket.io-client";
import React, { useEffect, useState } from "react";

export interface Props {
    socket: Socket;
    username: string;
}

const SendMessage = ({socket, username}: Props) => {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        socket.emit("send-message", {
            username,
            content: text,
            timeSent: new Date().toLocaleTimeString(),
        });

        setText("");
    }

    return (
        <form onSubmit={handleSubmit} className={"flex flex-row justify-between gap-x-4 w-full mt-4"}>
            <input type={"text"} className={"py-2 px-4 rounded-2xl w-full"} placeholder={"Message"}
                   value={text} onChange={(e) => setText(e.target.value)}/>
            <button type={"submit"} className={"rounded-2xl border border-white py-2 px-4"}>Submit</button>
        </form>
    )
}

export default SendMessage;