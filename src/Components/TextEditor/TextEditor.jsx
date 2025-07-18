import React from "react";

export default function TextEditor({
    input,
    handleRun,
    setInput,
    isProcessingQuery,
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                width: "100%",
                maxWidth: 700,
                margin: "0 auto",
                gap: "12px",
                paddingBottom: "5px",
            }}
        >
            <textarea
                name="prompt"
                id="prompt"
                value={input}
                disabled={isProcessingQuery}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleRun(e);
                    }
                }}
                style={{
                    flex: 1,
                    minHeight: "44px",
                    maxHeight: "200px",
                    resize: "vertical",
                    padding: "16px",
                    fontSize: "1rem",
                    borderRadius: "15px",
                    border: "1px solid #343541",
                    boxSizing: "border-box",
                    outline: "none",
                    background: "#343541",
                    color: "#f7f7f8",
                }}
                placeholder="Type your message..."
            />
            <button
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "48px",
                    minHeight: "44px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#3a3a4a", // lighter than #23232b for visibility
                    color: "#e0e0e3",
                    cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                    borderTop: "1px solid #343541",
                    borderLeft: "1px solid #343541",
                    padding: 0,
                }}
                onClick={handleRun}
                aria-label={isProcessingQuery ? "Stop" : "Send"}
            >
                {isProcessingQuery ? (
                    // Stop SVG (square)
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect
                            x="6"
                            y="6"
                            width="12"
                            height="12"
                            fill="#e74c3c"
                            stroke="#e0e0e3"
                        />
                    </svg>
                ) : (
                    // Play SVG (triangle)
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="5 3 19 12 5 21 5 3" fill="#e0e0e3" />
                    </svg>
                )}
            </button>
        </div>
    );
}
