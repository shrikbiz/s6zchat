export default function UserChatItem({ chatItem }) {
    return (
        <div
            style={{
                marginTop: "50px",
                marginBottom: "50px",
                display: "flex",
                justifyContent:
                    chatItem.role === "user" ? "flex-end" : "center",
            }}
        >
            <div
                style={{
                    maxWidth: "70%",
                    padding: "10px",
                    borderRadius: "10px",
                    background: "#383942", // dark gray for user
                    color: "#f7f7f8",
                    textAlign: "right",
                    border: "1px solid #444654",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                }}
            >
                <pre
                    style={{
                        lineHeight: "1.5",
                        margin: 0,
                        background: "none",
                        border: "none",
                        color: "inherit",
                        fontFamily: "system-ui, sans-serif",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                    }}
                >
                    {chatItem.content}
                </pre>
            </div>
        </div>
    );
}
