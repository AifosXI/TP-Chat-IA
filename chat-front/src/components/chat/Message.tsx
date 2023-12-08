import TranslateMessage from "@/components/chat/TranslateMessage";
import VerifyMessage from "@/components/chat/VerifyMessage";

export interface IMessage {
    username: string;
    content: string;
    timeSent: string;
}

interface Props {
    message: IMessage;
    isMe: boolean;
    language: string;
}

const Message = ({ message, isMe, language }: Props) => {
    return (
        <div className={`w-fit mt-2 ${isMe ? "ml-auto flex flex-col items-end" : ""}`}>
            <p className={"text-sm mt-4 first:mt-0"}>{message.username}</p>
            <div className={`flex flex-col w-fit border ${isMe ? "border-white" : "border-blue-500"} py-2 px-4 rounded-md mt-2`}>
                <p className={"text-lg"}>{message.content}</p>
                <p className={"text-sm italic"}>{message.timeSent}</p>
            </div>
            <TranslateMessage className={`${isMe ? "text-right" : ""}`} message={message.content} language={language}/>
            <VerifyMessage className={`${isMe ? "text-right" : ""}`} message={message.content}/>
        </div>

    );
};

export default Message;