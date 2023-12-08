import React, {useState} from "react";

interface Props {
    message: string;
    className: string;
}

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

const VerifyMessage = ({ message, className }: Props) => {

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
                prompt: `Verify if this statement is correct and if not explain why, if it is a question, answer it : ${message}`,
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
        setPrediction(prediction.response.output);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={`mt-1 text-sm text-blue-500 ${className}`}>
                <button type={"submit"}>Verify</button>
            </form>

            <div className={""}>
                {error && <p className={"text-red-500"}>An error has occured during the verification : {error}</p>}

                {predictionStatus === "succeeded" && (
                    <p>
                        Verification : {prediction.join("")}
                    </p>
                )}

                {predictionStatus === "pending" && error === null && (
                    <p>
                        Verification : pending...
                    </p>
                )}
            </div>
        </>
    )
}

export default VerifyMessage;