import React, { forwardRef } from "react";
import "./index.css";

const TextEditor = forwardRef(
    ({ input, handleRun, setInput, isProcessingQuery }, ref) => {
        return (
            <div className="text-editor-container">
                <textarea
                    ref={ref}
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
                    className="text-editor-textarea"
                    placeholder="Type your message..."
                />
                <button
                    className="text-editor-button"
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
                            <polygon
                                points="5 3 19 12 5 21 5 3"
                                fill="#e0e0e3"
                            />
                        </svg>
                    )}
                </button>
            </div>
        );
    }
);

export default TextEditor;
