// src/db/ChatDB.js
import Dexie from "dexie";
import { liveQuery } from "dexie";

class ChatDB extends Dexie {
    chats;

    constructor() {
        super("ChatDatabase");
        this.version(1).stores({
            chats: "++id,chatId,chatName,createdOn",
        });
        this.chats = this.table("chats");
    }

    /**
     * Fetch chat list (paginated, sorted by createdOn DESC)
     * @param {number} offset - start index
     * @param {number} limit - how many items
     * @returns {Promise<Array<{chatId: string, chatName: string, createdOn: number}>>}
     */
    async getChatList(offset = 0, limit = 10) {
        return await this.chats
            .orderBy("createdOn")
            .reverse()
            .offset(offset)
            .limit(limit)
            .toArray()
            .then((items) =>
                items.map(({ chatId, chatName, createdOn }) => ({
                    chatId,
                    chatName,
                    createdOn,
                }))
            );
    }

    /**
     * Get a live, reactive chat list (paginated, sorted by createdOn DESC)
     * @param {number} offset
     * @param {number} limit
     * @returns {Observable<Array<{chatId: string, chatName: string, createdOn: number}>>}
     */
    getChatListLive(offset = 0, limit = 10) {
        return liveQuery(() =>
            this.chats
                .orderBy("createdOn")
                .reverse()
                .offset(offset)
                .limit(limit)
                .toArray()
                .then((items) =>
                    items.map(({ chatId, chatName, createdOn }) => ({
                        chatId,
                        chatName,
                        createdOn,
                    }))
                )
        );
    }

    /**
     * Get chat items by chatId
     * @param {string} chatId
     * @returns {Whole Chat object}
     */
    async getChatsByChatId(chatId) {
        return await this.chats.get({ chatId });
    }

    /**
     * Check if a chat with the given chatId exists
     * @param {string} chatId
     * @returns {Promise<boolean>}
     */
    async chatIdExists(chatId) {
        try {
            const exists =
                (await this.chats?.where("chatId")?.equals(chatId)?.count()) ??
                0;
            return exists > 0;
        } catch {}
    }

    /**
     * Create a new chat entry
     * @param {Object} data
     * @param {string} data.chatId
     * @param {string} data.chatName
     * @param {Array<{role: string, content: string}>} data.chatItem
     * @returns {Promise<number>} - new DB id
     */
    async createChat({ chatId, chatName, chatItem }) {
        return await this.chats.add({
            chatId,
            chatName,
            chatItem,
            createdOn: Date.now(),
        });
    }

    /**
     * Update chatItem for existing chat
     * @param {string} chatId
     * @param {Array<{role: string, content: string}>} chatItem
     * @returns {Promise<number>} - count of updated rows
     */
    async updateChatItems(chatId, chatItem) {
        return await this.chats
            .where("chatId")
            .equals(chatId)
            .modify({ chatItem });
    }

    /**
     * Delete a chat by chatId
     * @param {string} chatId
     * @returns {Promise<void>}
     */
    async deleteChatByChatId(chatId) {
        await this.chats.where("chatId").equals(chatId).delete();
    }

    /**
     * Delete all chats from the database
     * @returns {Promise<void>}
     */
    async deleteAllChats() {
        await this.chats.clear();
    }

    /**
     * Search chats by title or chatItem content (case-insensitive)
     * @param {string} query
     * @returns {Promise<Array<{chatId: string, chatName: string, chatItem: Array, createdOn: number}>>}
     */
    async searchChats(query) {
        const lowerQuery = query.toLowerCase();
        const allChats = await this.chats.toArray();
        return allChats.filter(chat => {
            const titleMatch = chat.chatName && chat.chatName.toLowerCase().includes(lowerQuery);
            const itemMatch = chat.chatItem && chat.chatItem.some(item =>
                item.content && item.content.toLowerCase().includes(lowerQuery)
            );
            return titleMatch || itemMatch;
        });
    }
}

const chatDB = new ChatDB();
export default chatDB;
