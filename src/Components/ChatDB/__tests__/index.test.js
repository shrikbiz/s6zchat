import chatDB from '../index';
import Dexie from 'dexie';
import { liveQuery } from 'dexie';

// Mock Dexie and liveQuery
jest.mock('dexie', () => {
  const mockTable = {
    orderBy: jest.fn().mockReturnThis(),
    reverse: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    toArray: jest.fn(),
    get: jest.fn(),
    where: jest.fn().mockReturnThis(),
    equals: jest.fn().mockReturnThis(),
    count: jest.fn(),
    add: jest.fn(),
    modify: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  };

  const mockDexie = jest.fn().mockImplementation(() => ({
    version: jest.fn().mockReturnValue({
      stores: jest.fn(),
    }),
    table: jest.fn().mockReturnValue(mockTable),
    chats: mockTable,
  }));

  return mockDexie;
});

jest.mock('dexie', () => ({
  __esModule: true,
  default: jest.fn(),
  liveQuery: jest.fn(),
}));

// Setup mock implementations
const mockChatsTable = {
  orderBy: jest.fn().mockReturnThis(),
  reverse: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
  get: jest.fn(),
  where: jest.fn().mockReturnThis(),
  equals: jest.fn().mockReturnThis(),
  count: jest.fn(),
  add: jest.fn(),
  modify: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
};

describe('ChatDB', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the chats table mock
    chatDB.chats = mockChatsTable;
  });

  describe('getChatList', () => {
    test('returns paginated chat list sorted by createdOn DESC', async () => {
      const mockChats = [
        { id: 1, chatId: 'chat1', chatName: 'Chat 1', createdOn: 1000, chatItem: [] },
        { id: 2, chatId: 'chat2', chatName: 'Chat 2', createdOn: 2000, chatItem: [] },
      ];

      mockChatsTable.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.getChatList(0, 10);

      expect(mockChatsTable.orderBy).toHaveBeenCalledWith('createdOn');
      expect(mockChatsTable.reverse).toHaveBeenCalled();
      expect(mockChatsTable.offset).toHaveBeenCalledWith(0);
      expect(mockChatsTable.limit).toHaveBeenCalledWith(10);
      expect(result).toEqual([
        { chatId: 'chat1', chatName: 'Chat 1', createdOn: 1000 },
        { chatId: 'chat2', chatName: 'Chat 2', createdOn: 2000 },
      ]);
    });

    test('uses default pagination parameters', async () => {
      mockChatsTable.toArray.mockResolvedValue([]);

      await chatDB.getChatList();

      expect(mockChatsTable.offset).toHaveBeenCalledWith(0);
      expect(mockChatsTable.limit).toHaveBeenCalledWith(10);
    });

    test('handles custom pagination parameters', async () => {
      mockChatsTable.toArray.mockResolvedValue([]);

      await chatDB.getChatList(20, 5);

      expect(mockChatsTable.offset).toHaveBeenCalledWith(20);
      expect(mockChatsTable.limit).toHaveBeenCalledWith(5);
    });

    test('handles empty result', async () => {
      mockChatsTable.toArray.mockResolvedValue([]);

      const result = await chatDB.getChatList();

      expect(result).toEqual([]);
    });

    test('handles database errors', async () => {
      mockChatsTable.toArray.mockRejectedValue(new Error('Database error'));

      await expect(chatDB.getChatList()).rejects.toThrow('Database error');
    });
  });

  describe('getChatListLive', () => {
    test('returns live query with correct parameters', () => {
      const mockLiveQuery = jest.fn();
      require('dexie').liveQuery.mockImplementation(mockLiveQuery);

      chatDB.getChatListLive(5, 15);

      expect(mockLiveQuery).toHaveBeenCalled();
      const queryFunction = mockLiveQuery.mock.calls[0][0];
      
      // Test the query function
      mockChatsTable.toArray.mockResolvedValue([
        { chatId: 'test', chatName: 'Test', createdOn: 123 }
      ]);
      
      queryFunction();

      expect(mockChatsTable.offset).toHaveBeenCalledWith(5);
      expect(mockChatsTable.limit).toHaveBeenCalledWith(15);
    });

    test('uses default parameters for live query', () => {
      const mockLiveQuery = jest.fn();
      require('dexie').liveQuery.mockImplementation(mockLiveQuery);

      chatDB.getChatListLive();

      expect(mockLiveQuery).toHaveBeenCalled();
    });
  });

  describe('getChatsByChatId', () => {
    test('retrieves chat by chatId', async () => {
      const mockChat = {
        id: 1,
        chatId: 'test-chat',
        chatName: 'Test Chat',
        chatItem: [{ role: 'user', content: 'Hello' }],
        createdOn: 123456,
      };

      mockChatsTable.get.mockResolvedValue(mockChat);

      const result = await chatDB.getChatsByChatId('test-chat');

      expect(mockChatsTable.get).toHaveBeenCalledWith({ chatId: 'test-chat' });
      expect(result).toEqual(mockChat);
    });

    test('returns undefined for non-existent chat', async () => {
      mockChatsTable.get.mockResolvedValue(undefined);

      const result = await chatDB.getChatsByChatId('non-existent');

      expect(result).toBeUndefined();
    });

    test('handles database errors', async () => {
      mockChatsTable.get.mockRejectedValue(new Error('Database error'));

      await expect(chatDB.getChatsByChatId('test')).rejects.toThrow('Database error');
    });
  });

  describe('chatIdExists', () => {
    test('returns true when chat exists', async () => {
      mockChatsTable.count.mockResolvedValue(1);

      const result = await chatDB.chatIdExists('existing-chat');

      expect(mockChatsTable.where).toHaveBeenCalledWith('chatId');
      expect(mockChatsTable.equals).toHaveBeenCalledWith('existing-chat');
      expect(mockChatsTable.count).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    test('returns false when chat does not exist', async () => {
      mockChatsTable.count.mockResolvedValue(0);

      const result = await chatDB.chatIdExists('non-existent');

      expect(result).toBe(false);
    });

    test('handles null/undefined count', async () => {
      mockChatsTable.count.mockResolvedValue(null);

      const result = await chatDB.chatIdExists('test');

      expect(result).toBe(false);
    });

    test('handles database errors gracefully', async () => {
      mockChatsTable.count.mockRejectedValue(new Error('Database error'));

      const result = await chatDB.chatIdExists('test');

      expect(result).toBeUndefined();
    });

    test('handles undefined chats table', async () => {
      chatDB.chats = undefined;

      const result = await chatDB.chatIdExists('test');

      expect(result).toBeUndefined();
    });
  });

  describe('createChat', () => {
    test('creates new chat with correct data', async () => {
      const chatData = {
        chatId: 'new-chat',
        chatName: 'New Chat',
        chatItem: [{ role: 'user', content: 'Hello' }],
      };

      const mockId = 123;
      mockChatsTable.add.mockResolvedValue(mockId);

      // Mock Date.now()
      const mockNow = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      const result = await chatDB.createChat(chatData);

      expect(mockChatsTable.add).toHaveBeenCalledWith({
        ...chatData,
        createdOn: mockNow,
      });
      expect(result).toBe(mockId);

      Date.now.mockRestore();
    });

    test('handles empty chatItem array', async () => {
      const chatData = {
        chatId: 'empty-chat',
        chatName: 'Empty Chat',
        chatItem: [],
      };

      mockChatsTable.add.mockResolvedValue(1);

      await chatDB.createChat(chatData);

      expect(mockChatsTable.add).toHaveBeenCalledWith(
        expect.objectContaining(chatData)
      );
    });

    test('handles database errors', async () => {
      mockChatsTable.add.mockRejectedValue(new Error('Database error'));

      const chatData = {
        chatId: 'test',
        chatName: 'Test',
        chatItem: [],
      };

      await expect(chatDB.createChat(chatData)).rejects.toThrow('Database error');
    });
  });

  describe('updateChatItems', () => {
    test('updates chat items for existing chat', async () => {
      const chatId = 'existing-chat';
      const newChatItem = [
        { role: 'user', content: 'Updated message' },
        { role: 'assistant', content: 'Updated response' },
      ];

      mockChatsTable.modify.mockResolvedValue(1);

      const result = await chatDB.updateChatItems(chatId, newChatItem);

      expect(mockChatsTable.where).toHaveBeenCalledWith('chatId');
      expect(mockChatsTable.equals).toHaveBeenCalledWith(chatId);
      expect(mockChatsTable.modify).toHaveBeenCalledWith({ chatItem: newChatItem });
      expect(result).toBe(1);
    });

    test('returns 0 for non-existent chat', async () => {
      mockChatsTable.modify.mockResolvedValue(0);

      const result = await chatDB.updateChatItems('non-existent', []);

      expect(result).toBe(0);
    });

    test('handles database errors', async () => {
      mockChatsTable.modify.mockRejectedValue(new Error('Database error'));

      await expect(
        chatDB.updateChatItems('test', [])
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteChatByChatId', () => {
    test('deletes chat by chatId', async () => {
      mockChatsTable.delete.mockResolvedValue();

      await chatDB.deleteChatByChatId('delete-me');

      expect(mockChatsTable.where).toHaveBeenCalledWith('chatId');
      expect(mockChatsTable.equals).toHaveBeenCalledWith('delete-me');
      expect(mockChatsTable.delete).toHaveBeenCalled();
    });

    test('handles deletion of non-existent chat', async () => {
      mockChatsTable.delete.mockResolvedValue();

      await expect(
        chatDB.deleteChatByChatId('non-existent')
      ).resolves.not.toThrow();
    });

    test('handles database errors', async () => {
      mockChatsTable.delete.mockRejectedValue(new Error('Database error'));

      await expect(
        chatDB.deleteChatByChatId('test')
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteAllChats', () => {
    test('clears all chats from database', async () => {
      mockChatsTable.clear.mockResolvedValue();

      await chatDB.deleteAllChats();

      expect(mockChatsTable.clear).toHaveBeenCalled();
    });

    test('handles database errors', async () => {
      mockChatsTable.clear.mockRejectedValue(new Error('Database error'));

      await expect(chatDB.deleteAllChats()).rejects.toThrow('Database error');
    });
  });

  describe('searchChats', () => {
    beforeEach(() => {
      // Reset the mock to avoid chaining issues
      chatDB.chats = {
        toArray: jest.fn(),
      };
    });

    test('searches by chat title (case-insensitive)', async () => {
      const mockChats = [
        { chatId: '1', chatName: 'React Tutorial', chatItem: [] },
        { chatId: '2', chatName: 'Vue Guide', chatItem: [] },
        { chatId: '3', chatName: 'Angular Basics', chatItem: [] },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('react');

      expect(result).toEqual([
        { chatId: '1', chatName: 'React Tutorial', chatItem: [] },
      ]);
    });

    test('searches by chat content (case-insensitive)', async () => {
      const mockChats = [
        {
          chatId: '1',
          chatName: 'Chat 1',
          chatItem: [{ role: 'user', content: 'How do I use React hooks?' }],
        },
        {
          chatId: '2',
          chatName: 'Chat 2',
          chatItem: [{ role: 'user', content: 'What is Vue.js?' }],
        },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('REACT');

      expect(result).toEqual([mockChats[0]]);
    });

    test('searches both title and content', async () => {
      const mockChats = [
        {
          chatId: '1',
          chatName: 'JavaScript Tutorial',
          chatItem: [{ role: 'user', content: 'Learning JS' }],
        },
        {
          chatId: '2',
          chatName: 'Python Guide',
          chatItem: [{ role: 'user', content: 'JavaScript vs Python' }],
        },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('javascript');

      expect(result).toHaveLength(2);
    });

    test('returns empty array for no matches', async () => {
      const mockChats = [
        { chatId: '1', chatName: 'React', chatItem: [] },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('nonexistent');

      expect(result).toEqual([]);
    });

    test('handles chats with null/undefined names and content', async () => {
      const mockChats = [
        { chatId: '1', chatName: null, chatItem: null },
        { chatId: '2', chatName: undefined, chatItem: undefined },
        { chatId: '3', chatName: 'Valid Chat', chatItem: [{ role: 'user', content: null }] },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('valid');

      expect(result).toEqual([mockChats[2]]);
    });

    test('handles empty search query', async () => {
      const mockChats = [
        { chatId: '1', chatName: 'Chat 1', chatItem: [] },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('');

      expect(result).toEqual(mockChats);
    });

    test('handles database errors', async () => {
      chatDB.chats.toArray.mockRejectedValue(new Error('Database error'));

      await expect(chatDB.searchChats('test')).rejects.toThrow('Database error');
    });

    test('searches within multiple chat items', async () => {
      const mockChats = [
        {
          chatId: '1',
          chatName: 'Multi-message chat',
          chatItem: [
            { role: 'user', content: 'Hello' },
            { role: 'assistant', content: 'Hi there!' },
            { role: 'user', content: 'How are you doing?' },
          ],
        },
      ];

      chatDB.chats.toArray.mockResolvedValue(mockChats);

      const result = await chatDB.searchChats('doing');

      expect(result).toEqual(mockChats);
    });
  });

  describe('Edge Cases', () => {
    test('handles extremely large datasets', async () => {
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        chatId: `chat-${i}`,
        chatName: `Chat ${i}`,
        chatItem: [],
        createdOn: i,
      }));

      mockChatsTable.toArray.mockResolvedValue(largeDataset);

      const result = await chatDB.getChatList(0, 100);

      expect(result).toHaveLength(largeDataset.length);
    });

    test('handles special characters in search', async () => {
      const mockChats = [
        { chatId: '1', chatName: 'Chat with émojis 🚀', chatItem: [] },
        { chatId: '2', chatName: 'Normal chat', chatItem: [] },
      ];

      chatDB.chats = { toArray: jest.fn().mockResolvedValue(mockChats) };

      const result = await chatDB.searchChats('émojis');

      expect(result).toEqual([mockChats[0]]);
    });

    test('handles concurrent operations', async () => {
      mockChatsTable.add.mockResolvedValue(1);
      mockChatsTable.get.mockResolvedValue({ chatId: 'test' });
      mockChatsTable.count.mockResolvedValue(1);

      const operations = [
        chatDB.createChat({ chatId: 'test1', chatName: 'Test 1', chatItem: [] }),
        chatDB.getChatsByChatId('test2'),
        chatDB.chatIdExists('test3'),
      ];

      await expect(Promise.all(operations)).resolves.not.toThrow();
    });
  });
});