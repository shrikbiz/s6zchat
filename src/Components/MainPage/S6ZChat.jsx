import { useEffect, useState, useRef } from "react";
import {
    decodeAndStreamResponse,
    getTitleForChat,
    requestOllama,
} from "@components/util";
import TextEditor from "@components/TextEditor/TextEditor";
import WelcomeScreen from "@components/Welcome";
import ChatList from "@components/ChatItems";
import chatDB from "@components/ChatDB";

export default function ChatPlayground() {
    const [chatId, setChatId] = useState(null);

    const [chatItems, setChatItems] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [isProcessingQuery, setIsProcessingQuery] = useState(false);
    const controllerRef = useRef(null);
    const [chatTitle, setChatTitle] = useState(null);
    const chatListRef = useRef(null); // Add ref for chat list

    useEffect(() => {
        async function getChatIdAndUpdateChatItems() {
            // Get chatId from the URL path ("/chat/:chatId?")
            const pathMatch =
                window.location.pathname.match(/^\/chat\/([^/]+)$/);
            const chatIdFromURL = pathMatch ? pathMatch[1] : null;
            if (!chatId) {
                if (chatIdFromURL) {
                    setChatId(chatIdFromURL);

                    const storedChatItem =
                        await chatDB.getChatsByChatId(chatIdFromURL);

                    if (storedChatItem) {
                        // Updates chatTitle
                        if (storedChatItem?.chatName)
                            setChatTitle(storedChatItem.chatName);

                        // Updates chatItems
                        if (storedChatItem?.chatItem?.length)
                            setChatItems(storedChatItem.chatItem);
                    }
                    scrollToBottom();
                } else {
                    setChatId(generateUniqueId());
                }
            }
        }
        getChatIdAndUpdateChatItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleRun(e) {
        if (isProcessingQuery && controllerRef.current) {
            try {
                controllerRef.current.abort();
            } catch {
                // nothing.
            }
        } else {
            e.preventDefault();
            setChatItems((prev) => [
                ...prev,
                { role: "user", content: prompt },
            ]);
            setPrompt("");
        }
    }

    useEffect(() => {
        let isFetching = false;

        async function fetchTitle() {
            isFetching = true;
            const firstQuery = chatItems[0].content;
            const title = await getTitleForChat(firstQuery);
            setChatTitle(title);

            //-----

            await chatDB.createChat({
                chatId,
                chatName: title,
                chatItem: chatItems,
            });
            //-----
            isFetching = true;
        }

        if (!isFetching && chatItems.length > 1 && !chatTitle) {
            fetchTitle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatItems.length]);

    function scrollToBottom() {
        if (chatListRef.current) {
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }

    async function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    async function fetchMessages() {
        const controller = new AbortController();
        controllerRef.current = controller;

        setIsProcessingQuery(true);
        await delay(400);
        const newAgentResponse = {
            role: "assistant",
            content: "",
            isLoading: true,
            isStreaming: true,
        };
        setChatItems((prev) => [...prev, newAgentResponse]);

        try {
            scrollToBottom();
            const response = await requestOllama(chatItems, controller);
            decodeAndStreamResponse(
                response,
                setChatItems,
                setIsProcessingQuery
            );
        } catch (error) {
            console.error(error);
        } finally {
            setChatItems((prev) => {
                const newChatItems = [...prev];
                newChatItems[newChatItems.length - 1].isLoading = false;
                newChatItems[newChatItems.length - 1].isStreaming = false;
                return newChatItems;
            });
        }
    }

    useEffect(() => {
        let timer;
        if (chatItems.length && chatItems[chatItems.length - 1].role === "user")
            fetchMessages();

        function updateChatDB() {
            timer = setTimeout(async () => {
                const isExistingChat = await chatDB.chatIdExists(chatId);

                if (isExistingChat) {
                    chatDB.updateChatItems(chatId, chatItems);
                }
            }, 1000);
        }

        if (chatItems.length) {
            updateChatDB();
        }

        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatItems]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
                background: "#1a1a1a", // Updated to match layout background
                color: "#e5e5e5", // light text for contrast
            }}
        >
            <div
                style={{
                    position: "relative",
                    flex: 1,
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                <div
                    ref={chatListRef}
                    style={{
                        position: "absolute",
                        inset: 0,
                        transition:
                            "opacity 0.4s cubic-bezier(.4,0,.2,1), visibility 0.4s",
                        opacity: chatItems.length ? 1 : 0,
                        visibility: chatItems.length ? "visible" : "hidden",
                        pointerEvents: chatItems.length ? "auto" : "none",
                        overflowY: "auto",
                        padding: "24px 0",
                        boxSizing: "border-box",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <ChatList chatItems={chatItems} />
                </div>
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        transition:
                            "opacity 0.4s cubic-bezier(.4,0,.2,1), visibility 0.4s",
                        opacity: chatItems.length ? 0 : 1,
                        visibility: chatItems.length ? "hidden" : "visible",
                        pointerEvents: chatItems.length ? "none" : "auto",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <WelcomeScreen />
                </div>
            </div>
            <TextEditor
                handleRun={handleRun}
                input={prompt}
                setInput={setPrompt}
                isProcessingQuery={isProcessingQuery}
            />
        </div>
    );
}

/** Generates unique ID for the chat */
export function generateUniqueId() {
    return crypto.randomUUID();
}

// async function useChatItems() {
//     const [chatItems, setChatItems] = useState([]);
//     // Get chatId from URL parameters
//     const CHAT_ID = generateUniqueId();
//     if (typeof window !== "undefined") {
//         const params = new URLSearchParams(window.location.search);
//         CHAT_ID = params.get("chatId");
//     }
//     await chatDB.getChatItemsById(CHAT_ID);
// }
