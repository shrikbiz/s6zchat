import Layout from "@components/Layout";
import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import chatDB from "@components/ChatDB";
import ChatPlayground from "./S6ZChat";

export default function S6ZChat() {
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(30); // 30 for first fetch, then 10
    const [chatList, setChatList] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const chatListSection = useLiveQuery(
        () => chatDB.getChatList(offset, limit),
        [offset, limit]
    );

    useEffect(() => {
        if (chatListSection) {
            if (offset === 0) {
                setChatList(chatListSection);
                setLimit(10); // After first fetch, set limit to 10
            } else if (chatListSection.length > 0) {
                setChatList((prev) => [...prev, ...chatListSection]);
            }
            setLoadingMore(false); // Reset loading flag after data is appended
        }
    }, [chatListSection, offset]);

    return (
        <Layout
            setOffset={setOffset}
            chatListSection={chatListSection}
            limit={limit}
            loadingMore={loadingMore}
            setLoadingMore={setLoadingMore}
            chatList={chatList}
            setChatList={setChatList}
        >
            <ChatPlayground />
        </Layout>
    );
}
