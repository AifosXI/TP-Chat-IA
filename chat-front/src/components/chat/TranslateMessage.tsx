import React, {useState} from "react";

interface Props {
    message: string;
    language: string;
    className: string;
}

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

const TranslateMessage = ({ message, language, className }: Props) => {

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
                version: '7bf2629623162c0cf22ace9ec7a94b34045c1cfa2ed82586f05f3a60b1ca2da5',
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

            setPredictionStatus("pending");
            setPrediction(prediction.response.output);
        }

        setPredictionStatus("succeeded");
    }

    return (
        <>
            {language !== "" && predictionStatus !== "succeeded" &&
                <form onSubmit={handleSubmit} className={`mt-1 text-sm text-blue-500 ${className}`}>
                    <button type={"submit"}>Translate</button>
                </form>
            }
            <div>
                {error && <p className={"text-red-500"}>An error has occured during the translation : {error}</p>}

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