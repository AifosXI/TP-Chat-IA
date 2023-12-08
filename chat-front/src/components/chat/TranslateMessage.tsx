import {IMessage} from "@/components/chat/Message";
import React, {useState} from "react";

interface Props {
    message: string;
    language: string;
}

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

const TranslateMessage = ({ message, language }: Props) => {

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
                prompt: `translate this in ${language} : ${message}`,
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

            console.log(prediction.response.output);
            setPredictionStatus("pending");
            setPrediction(prediction.response.output);
        }

        setPredictionStatus("succeeded");
    }

    return (
        <>
            {language !== "" &&
                <form onSubmit={handleSubmit} className={"flex flex-row justify-between gap-x-4 w-full mt-1 text-sm text-blue-500"}>
                    <button type={"submit"}>Translate</button>
                </form>
            }
            <div className={"ital"}>
                {error && <p className={"text-red-500"}>Une erreur est survenue pendant la traduction : {error}</p>}

                {predictionStatus === "succeeded" && (
                    <p>
                        Translation : {prediction.join("")}
                    </p>
                )}

                {predictionStatus === "pending" && error === null && (
                    <p>
                        Translation : pending...
                    </p>
                )}
            </div>
        </>
    )
}

export default TranslateMessage;