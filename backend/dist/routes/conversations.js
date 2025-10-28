"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mockConversations = [
    {
        id: '1',
        tenantId: 'tenant-1',
        channelId: '1',
        userId: 'user_123',
        userNickname: '张小明',
        userAvatar: 'https://example.com/avatar1.jpg',
        status: 'active',
        lastMessageAt: new Date(),
        messageCount: 5,
        score: 8,
        tags: ['高意向', '价格咨询'],
        createdAt: new Date(),
    },
    {
        id: '2',
        tenantId: 'tenant-1',
        channelId: '1',
        userId: 'user_456',
        userNickname: '李小红',
        userAvatar: 'https://example.com/avatar2.jpg',
        status: 'closed',
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 30),
        messageCount: 3,
        score: 6,
        tags: ['一般意向'],
        createdAt: new Date(),
    },
];
const mockMessages = [
    {
        id: '1',
        tenantId: 'tenant-1',
        conversationId: '1',
        type: 'user',
        content: '请问这个产品怎么购买？',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
        id: '2',
        tenantId: 'tenant-1',
        conversationId: '1',
        type: 'bot',
        content: '您好！欢迎咨询我们的产品。请告诉我您的具体需求，我会为您详细介绍。',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
    },
    {
        id: '3',
        tenantId: 'tenant-1',
        conversationId: '1',
        type: 'user',
        content: '价格是多少？',
        timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
        id: '4',
        tenantId: 'tenant-1',
        conversationId: '1',
        type: 'bot',
        content: '我们的产品价格根据配置不同，从299元到1999元不等。您需要哪种配置呢？',
        timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
        id: '5',
        tenantId: 'tenant-1',
        conversationId: '1',
        type: 'user',
        content: '我想了解一下1999元的配置',
        timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
];
router.get('/', (req, res) => {
    try {
        const { page = 1, limit = 10, status, channelId, score } = req.query;
        let filteredConversations = mockConversations;
        if (status) {
            filteredConversations = filteredConversations.filter(c => c.status === status);
        }
        if (channelId) {
            filteredConversations = filteredConversations.filter(c => c.channelId === channelId);
        }
        if (score) {
            const scoreNum = Number(score);
            filteredConversations = filteredConversations.filter(c => c.score >= scoreNum);
        }
        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);
        const paginatedConversations = filteredConversations.slice(start, end);
        res.json({
            success: true,
            message: '获取对话列表成功',
            data: {
                conversations: paginatedConversations,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: filteredConversations.length,
                    totalPages: Math.ceil(filteredConversations.length / Number(limit)),
                },
            },
        });
    }
    catch (error) {
        console.error('获取对话列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const conversation = mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: '对话不存在',
            });
        }
        res.json({
            success: true,
            message: '获取对话详情成功',
            data: { conversation },
        });
    }
    catch (error) {
        console.error('获取对话详情错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/:id/messages', (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 50 } = req.query;
        const conversation = mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: '对话不存在',
            });
        }
        const conversationMessages = mockMessages.filter(m => m.conversationId === id);
        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);
        const paginatedMessages = conversationMessages.slice(start, end);
        res.json({
            success: true,
            message: '获取消息列表成功',
            data: {
                messages: paginatedMessages,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: conversationMessages.length,
                    totalPages: Math.ceil(conversationMessages.length / Number(limit)),
                },
            },
        });
    }
    catch (error) {
        console.error('获取消息列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.post('/:id/messages', (req, res) => {
    try {
        const { id } = req.params;
        const { content, type = 'human' } = req.body;
        const conversation = mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: '对话不存在',
            });
        }
        const newMessage = {
            id: Date.now().toString(),
            tenantId: conversation.tenantId,
            conversationId: id,
            type: type,
            content,
            timestamp: new Date(),
        };
        mockMessages.push(newMessage);
        conversation.lastMessageAt = new Date();
        conversation.messageCount += 1;
        res.status(201).json({
            success: true,
            message: '发送消息成功',
            data: { message: newMessage },
        });
    }
    catch (error) {
        console.error('发送消息错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.put('/:id/close', (req, res) => {
    try {
        const { id } = req.params;
        const conversation = mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: '对话不存在',
            });
        }
        conversation.status = 'closed';
        res.json({
            success: true,
            message: '关闭对话成功',
            data: { conversation },
        });
    }
    catch (error) {
        console.error('关闭对话错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.put('/:id/score', (req, res) => {
    try {
        const { id } = req.params;
        const { score } = req.body;
        if (score < 0 || score > 10) {
            return res.status(400).json({
                success: false,
                message: '评分必须在0-10之间',
            });
        }
        const conversation = mockConversations.find(c => c.id === id);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: '对话不存在',
            });
        }
        conversation.score = score;
        res.json({
            success: true,
            message: '更新评分成功',
            data: { conversation },
        });
    }
    catch (error) {
        console.error('更新评分错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
module.exports = router;
//# sourceMappingURL=conversations.js.map