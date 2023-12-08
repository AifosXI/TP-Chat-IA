import React, {useEffect, useState} from "react";
import { Socket } from "socket.io-client";

interface Props {
    socket: Socket;
    setUsername: (username: string) => void;
}

const SendUsername = ({ socket, setUsername }: Props) => {
    const [text, setText] = useState("");
    const [exists, setExists] = useState(true);

    useEffect(() => {
        socket.on("username-exist", (data) => {
            setExists(data);
        });
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setUsername(text);

        if(!exists)
        {
            socket.emit("set-username", {
                username: text,
            });
        }
    };

    useEffect(() => {
        socket.emit("check-username-exist", {
            username: text,
        });
    }, [text]);

    return (
        <>
            <form onSubmit={handleSubmit} className={"flex flex-row justify-between gap-x-4 w-full mt-4"}>
                <input type={"text"} className={`py-2 px-4 text-black rounded-2xl w-full ${exists ? "border-4 border-red-500" : ""}`} placeholder={"Username"} value={text} onChange={(e) => setText(e.target.value)}/>
                {!exists && <button type={"submit"} className={"rounded-2xl border border-white py-2 px-4"}>Join</button>}

            </form>
        </>

    );
};

export default SendUsername;