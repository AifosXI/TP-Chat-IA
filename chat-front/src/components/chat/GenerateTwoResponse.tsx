import React, {useEffect, useState} from "react";
import {Socket} from "socket.io-client";

interface Props {
    message: string;
    username: string;
    socket: Socket;
}

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

const GenerateTwoResponse = ({message, socket, username}: Props) => {

    const [prediction, setPrediction] = useState([]);
    const [predictionStatus, setPredictionStatus] = useState("");
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState("");

    const generate = async () => {
        if(message !== "")
        {
            const response = await fetch("/api/predictions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: `Two persons are talking in a private conversation, one of the person responded with: ${message}, give two answer to send them back in their language, don't put translation in these answer`,
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

                console.log({prediction});

                setPredictionStatus("pending");
                setPrediction(prediction.response.output);
            }

            setPredictionStatus("succeeded");
        }

    }

    useEffect(() => {
        generate();
    }, [message]);

    let generatedAnswers: Array<string> = [];

    if(predictionStatus === "succeeded" && prediction.length > 0)
    {
        let joinedOutput = prediction.join("").replace('1.','').replace('2.','').replace('"', '').replace('\"', '');
        generatedAnswers = joinedOutput.split("\n");
        generatedAnswers = generatedAnswers.slice(2);
    }


    function handleSubmit(e : any) {
        e.preventDefault();

        socket.emit("send-message", {
            username,
            content: selectedMessage,
            timeSent: new Date().toLocaleTimeString(),
        });

        setPrediction([]);
        setPredictionStatus("pending");
    }

    return (
        <div className={"mt-4"}>
            {predictionStatus === "succeeded" && generatedAnswers.length > 0 && (
                <>
                    <p className={"mb-2"}>Generated answer :</p>
                    <div className={"flex flex-col gap-y-2"}>
                        {generatedAnswers.map((text, key) => (
                            <div className={"flex flex-row items-center gap-x-2 cursor-pointer"} key={key}>
                                <input className={"w-4 h-4 bg-black border border-white block"} type={"checkbox"} id={`answer-${key}`} name={`answer-${key}`} value={text} onClick={(e) => setSelectedMessage(text)}/>
                                <label htmlFor={`answer-${key}`}>{text}</label>
                            </div>

                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className={"mt-2"}>
                        <button type={"submit"}>Choose and send</button>
                    </form>
                </>

            )}
            {predictionStatus === "pending" && error === null && (
                <p>
                    Answer generation : pending...
                </p>
            )}
        </div>
    )
}

export default GenerateTwoResponse;