import message, {IMessage} from "@/components/chat/Message";
import Message from "@/components/chat/Message";

interface Props {
    messages: IMessage[];
    username: string;
}

const Messages = ({messages, username}: Props) => {
    return (
        <div>
            {messages.length > 0 &&
                messages.map((msg, key) => {
                    return(
                        <Message isMe={msg.username === username} key={msg.timeSent ?? key} message={msg} />
                    )
                })
            }
            {messages.length === 0 && (<p className={"text-center"}>There is no messages yet, join to start a conversation.</p>)}
        </div>
    )
}

export default Messages;