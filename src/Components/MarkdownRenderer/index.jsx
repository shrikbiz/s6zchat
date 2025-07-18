import React from "react";
import Markdown from "markdown-to-jsx";
import "./index.css"; // for styling

const MarkdownRenderer = ({ markdown }) => {
    // Helper to format code with basic indentation
    function formatCode(children) {
        let code = Array.isArray(children) ? children.join("") : children;

        // Basic formatting: ensure consistent indentation
        const lines = code.split("\n");
        const formattedLines = lines.map((line) => {
            // Remove excessive leading spaces but preserve structure
            return line.trim() === "" ? "" : line;
        });

        return formattedLines.join("\n");
    }

    return (
        <div className="markdown-content">
            <Markdown
                options={{
                    overrides: {
                        code: {
                            component: (props) => {
                                // Only format if it's a code block (not inline code)
                                const isCodeBlock =
                                    props?.className?.includes("language") ||
                                    props?.className?.includes("lang");

                                if (isCodeBlock) {
                                    return (
                                        <code className="custom-code">
                                            {formatCode(props.children)}
                                        </code>
                                    );
                                }
                                return (
                                    <code className="custom-code">
                                        {props.children}
                                    </code>
                                );
                            },
                        },
                        pre: {
                            component: (props) => (
                                <pre className="custom-pre">
                                    {props.children}
                                </pre>
                            ),
                        },
                    },
                }}
            >
                {markdown}
            </Markdown>
        </div>
    );
};

export default MarkdownRenderer;
