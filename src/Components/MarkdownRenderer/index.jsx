import React from "react";
import Markdown from "markdown-to-jsx";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css"; // Dark theme similar to VS Code
import "./index.css"; // for styling

const CodeBlock = ({ className, children }) => {
    const language = className?.replace("lang-", "") || "javascript";
    const html = Prism.highlight(children, Prism.languages[language], language);

    return (
        <pre className={`language-${language}`}>
            <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
    );
};

const PreBlock = ({ children }) => {
    // If children is a code element, let the CodeBlock handle it
    if (React.isValidElement(children) && children.type === "code") {
        return children;
    }

    // Otherwise, just render as a regular pre block
    return <pre className="custom-pre">{children}</pre>;
};

const MarkdownRenderer = ({ markdown }) => {
    return (
        <div className="markdown-content">
            <Markdown
                options={{
                    overrides: {
                        code: {
                            component: CodeBlock,
                        },
                        pre: {
                            component: PreBlock,
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
