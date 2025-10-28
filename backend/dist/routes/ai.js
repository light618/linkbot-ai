"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
const mockIntents = [
    {
        id: '1',
        tenantId: 'tenant-1',
        name: '价格咨询',
        keywords: ['价格', '多少钱', '费用', '成本'],
        response: '我们的产品价格根据配置不同，从299元到1999元不等。您需要哪种配置呢？',
        priority: 1,
        isActive: true,
        createdAt: new Date(),
    },
    {
        id: '2',
        tenantId: 'tenant-1',
        name: '产品介绍',
        keywords: ['介绍', '功能', '特点', '优势'],
        response: '我们的产品具有以下特点：1. 高效稳定 2. 易于使用 3. 性价比高。您想了解哪个方面？',
        priority: 2,
        isActive: true,
        createdAt: new Date(),
    },
];
const mockAIModels = [
    {
        id: '1',
        tenantId: 'tenant-1',
        name: 'Coze GPT-4o',
        provider: 'coze',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 2000,
        isActive: true,
        config: {
            botId: process.env.COZE_BOT_ID || 'your_bot_id',
            apiKey: process.env.COZE_TOKEN || 'your_token',
        },
    },
];
router.get('/intents', (req, res) => {
    try {
        const { page = 1, limit = 10, isActive } = req.query;
        let filteredIntents = mockIntents;
        if (isActive !== undefined) {
            filteredIntents = filteredIntents.filter(i => i.isActive === (isActive === 'true'));
        }
        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);
        const paginatedIntents = filteredIntents.slice(start, end);
        res.json({
            success: true,
            message: '获取意图列表成功',
            data: {
                intents: paginatedIntents,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: filteredIntents.length,
                    totalPages: Math.ceil(filteredIntents.length / Number(limit)),
                },
            },
        });
    }
    catch (error) {
        console.error('获取意图列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.post('/intents', (req, res) => {
    try {
        const { name, keywords, response, priority, isActive } = req.body;
        const newIntent = {
            id: Date.now().toString(),
            tenantId: 'tenant-1',
            name,
            keywords: keywords || [],
            response,
            priority: priority || 1,
            isActive: isActive !== false,
            createdAt: new Date(),
        };
        mockIntents.push(newIntent);
        res.status(201).json({
            success: true,
            message: '创建意图成功',
            data: { intent: newIntent },
        });
    }
    catch (error) {
        console.error('创建意图错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/models', (req, res) => {
    try {
        res.json({
            success: true,
            message: '获取AI模型列表成功',
            data: { models: mockAIModels },
        });
    }
    catch (error) {
        console.error('获取AI模型列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.post('/reply', async (req, res) => {
    try {
        const { message, conversationId, userId, channelId } = req.body;
        if (!message) {
            return res.status(400).json({
                success: false,
                message: '消息内容不能为空',
            });
        }
        const matchedIntent = mockIntents.find(intent => intent.isActive &&
            intent.keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase())));
        if (matchedIntent) {
            return res.json({
                success: true,
                message: 'AI回复成功',
                data: {
                    reply: matchedIntent.response,
                    source: 'intent',
                    intentId: matchedIntent.id,
                },
            });
        }
        try {
            const cozeResponse = await axios_1.default.post(`${process.env.COZE_API_URL || 'https://api.coze.com/open/v1'}/bot/chat`, {
                bot_id: process.env.COZE_BOT_ID,
                user: userId,
                query: message,
                stream: false,
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.COZE_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            const reply = cozeResponse.data?.data?.messages?.[0]?.content || '抱歉，我暂时无法理解您的问题，请稍后再试。';
            return res.json({
                success: true,
                message: 'AI回复成功',
                data: {
                    reply,
                    source: 'coze',
                    model: 'gpt-4o',
                },
            });
        }
        catch (cozeError) {
            console.error('Coze API 调用失败:', cozeError);
            return res.json({
                success: true,
                message: 'AI回复成功',
                data: {
                    reply: '感谢您的咨询！我们的客服会尽快回复您。',
                    source: 'fallback',
                },
            });
        }
    }
    catch (error) {
        console.error('AI回复错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.post('/audit', async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({
                success: false,
                message: '内容不能为空',
            });
        }
        const sensitiveWords = ['政治', '色情', '暴力', '赌博'];
        const detectedWords = sensitiveWords.filter(word => content.toLowerCase().includes(word.toLowerCase()));
        const isBlocked = detectedWords.length > 0;
        res.json({
            success: true,
            message: '内容审核完成',
            data: {
                isBlocked,
                detectedWords,
                confidence: detectedWords.length > 0 ? 0.9 : 0.1,
                action: isBlocked ? 'block' : 'pass',
            },
        });
    }
    catch (error) {
        console.error('内容审核错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/stats', (req, res) => {
    try {
        const totalIntents = mockIntents.length;
        const activeIntents = mockIntents.filter(i => i.isActive).length;
        const totalModels = mockAIModels.length;
        const activeModels = mockAIModels.filter(m => m.isActive).length;
        res.json({
            success: true,
            message: '获取AI统计成功',
            data: {
                totalIntents,
                activeIntents,
                totalModels,
                activeModels,
                avgResponseTime: 1.2,
                successRate: 95.5,
            },
        });
    }
    catch (error) {
        console.error('获取AI统计错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
module.exports = router;
//# sourceMappingURL=ai.js.map