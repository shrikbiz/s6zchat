import AgentChatItem from "./AgentChatItem";
import UserChatItem from "./UserChat";

export default function ChatList({ chatItems }) {
    return (
        <div
            style={{
                width: "100%",
                maxWidth: 800,
                minWidth: 0,
                margin: "0 auto",
                padding: "0 16px",
                boxSizing: "border-box",
            }}
        >
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
