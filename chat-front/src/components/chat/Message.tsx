export interface IMessage {
    username: string;
    content: string;
    timeSent: string;
}

interface Props {
    message: IMessage;
    isMe: boolean;
}

const Message = ({ message, isMe }: Props) => {
    return (
        <div className={`w-fit ${isMe ? "ml-auto" : ""}`}>
            <p className={"text-sm mt-4 first:mt-0"}>{message.username}</p>
            <div className={`flex flex-col w-fit border ${isMe ? "border-white" : "border-blue-500"} py-2 px-4 rounded-md mt-2`}>
                <p className={"text-lg"}>{message.content}</p>
                <p className={"text-sm italic"}>{message.timeSent}</p>
            </div>
        </div>

    );
};

export default Message;