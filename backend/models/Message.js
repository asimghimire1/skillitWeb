const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../data.json');

const readData = () => {
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
};

class Message {
    static async create(messageData) {
        const data = readData();
        if (!data.messages) data.messages = [];

        const newMessage = {
            id: data.messages.length + 1,
            senderId: messageData.senderId,
            receiverId: messageData.receiverId,
            content: messageData.content,
            threadId: messageData.threadId || `${Math.min(messageData.senderId, messageData.receiverId)}_${Math.max(messageData.senderId, messageData.receiverId)}`,
            attachments: messageData.attachments || [],
            isRead: false,
            created_at: new Date().toISOString()
        };

        data.messages.push(newMessage);
        writeData(data);
        return newMessage;
    }

    static async getThreads(userId) {
        const data = readData();
        if (!data.messages) return [];

        const userMessages = data.messages.filter(m =>
            m.senderId === parseInt(userId) || m.receiverId === parseInt(userId)
        );

        const threads = {};
        userMessages.forEach(msg => {
            if (!threads[msg.threadId]) {
                threads[msg.threadId] = {
                    threadId: msg.threadId,
                    lastMessage: msg,
                    unreadCount: 0,
                    otherUserId: msg.senderId === parseInt(userId) ? msg.receiverId : msg.senderId
                };
            } else {
                if (new Date(msg.created_at) > new Date(threads[msg.threadId].lastMessage.created_at)) {
                    threads[msg.threadId].lastMessage = msg;
                }
            }

            if (!msg.isRead && msg.receiverId === parseInt(userId)) {
                threads[msg.threadId].unreadCount++;
            }
        });

        return Object.values(threads);
    }

    static async getThreadMessages(threadId, userId) {
        const data = readData();
        if (!data.messages) return [];

        const messages = data.messages.filter(m => m.threadId === threadId);

        // Mark as read
        data.messages = data.messages.map(m => {
            if (m.threadId === threadId && m.receiverId === parseInt(userId) && !m.isRead) {
                return { ...m, isRead: true };
            }
            return m;
        });
        writeData(data);

        return messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    static async markAsRead(messageId) {
        const data = readData();
        if (!data.messages) return null;

        const messageIndex = data.messages.findIndex(m => m.id === parseInt(messageId));
        if (messageIndex !== -1) {
            data.messages[messageIndex].isRead = true;
            writeData(data);
            return data.messages[messageIndex];
        }
        return null;
    }
}

module.exports = Message;
