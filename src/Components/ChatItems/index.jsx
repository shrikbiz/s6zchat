import AgentChatItem from "./AgentChatItem";
import UserChatItem from "./UserChat";
import "./index.css";

export default function ChatList({ chatItems }) {
    return (
        <div className="chat-list-container">
            {chatItems.map((chatItem, index) => (
                <div key={index}>
                    {chatItem.role === "user" ? (
                        <UserChatItem chatItem={chatItem} />
                    ) : (
                        <AgentChatItem chatItem={chatItem} />
                    )}
                </div>
            ))}
        </div>
    );
}
