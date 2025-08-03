import "./UserChat.css";

export default function UserChatItem({ chatItem }) {
    return (
        <div
            className="user-chat-container"
            style={{
                justifyContent:
                    chatItem.role === "user" ? "flex-end" : "center",
            }}
        >
            <div className="user-chat-message">
                <pre className="user-chat-content">
                    {chatItem.content}
                </pre>
            </div>
        </div>
    );
}
