import React, {useState} from "react";

interface Props {
    setLanguage: (language: string) => void;
}

const SetLanguage = ({ setLanguage }: Props) => {
    const [text, setText] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLanguage(text);
    };

    return (
        <form onSubmit={handleSubmit} className={"flex flex-row justify-between gap-x-4 w-1/3"}>
            <input type={"text"} className={"py-2 px-4 text-black rounded-2xl w-full"} placeholder={"Language"}
                   value={text} onChange={(e) => setText(e.target.value)}/>
            <button type={"submit"} className={"rounded-2xl border border-white py-2 px-4"}>Submit</button>
        </form>
    )
}

export default SetLanguage;