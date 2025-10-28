"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const mockLeads = [
    {
        id: '1',
        tenantId: 'tenant-1',
        conversationId: '1',
        channelId: '1',
        userId: 'user_123',
        userNickname: '张小明',
        phone: '13800138000',
        email: 'zhang@example.com',
        score: 8,
        status: 'new',
        assignedTo: 'operator_1',
        tags: ['高意向', '价格咨询'],
        notes: '对1999元配置很感兴趣',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        tenantId: 'tenant-1',
        conversationId: '2',
        channelId: '1',
        userId: 'user_456',
        userNickname: '李小红',
        phone: '13900139000',
        score: 6,
        status: 'contacted',
        tags: ['一般意向'],
        notes: '已电话联系，需要进一步跟进',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
router.get('/', (req, res) => {
    try {
        const { page = 1, limit = 10, status, channelId, score, assignedTo } = req.query;
        let filteredLeads = mockLeads;
        if (status) {
            filteredLeads = filteredLeads.filter(l => l.status === status);
        }
        if (channelId) {
            filteredLeads = filteredLeads.filter(l => l.channelId === channelId);
        }
        if (score) {
            const scoreNum = Number(score);
            filteredLeads = filteredLeads.filter(l => l.score >= scoreNum);
        }
        if (assignedTo) {
            filteredLeads = filteredLeads.filter(l => l.assignedTo === assignedTo);
        }
        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);
        const paginatedLeads = filteredLeads.slice(start, end);
        res.json({
            success: true,
            message: '获取线索列表成功',
            data: {
                leads: paginatedLeads,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: filteredLeads.length,
                    totalPages: Math.ceil(filteredLeads.length / Number(limit)),
                },
            },
        });
    }
    catch (error) {
        console.error('获取线索列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const lead = mockLeads.find(l => l.id === id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: '线索不存在',
            });
        }
        res.json({
            success: true,
            message: '获取线索详情成功',
            data: { lead },
        });
    }
    catch (error) {
        console.error('获取线索详情错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.post('/', (req, res) => {
    try {
        const { conversationId, channelId, userId, userNickname, phone, email, score, tags, notes } = req.body;
        const newLead = {
            id: Date.now().toString(),
            tenantId: 'tenant-1',
            conversationId,
            channelId,
            userId,
            userNickname,
            phone,
            email,
            score: score || 0,
            status: 'new',
            tags: tags || [],
            notes: notes || '',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        mockLeads.push(newLead);
        res.status(201).json({
            success: true,
            message: '创建线索成功',
            data: { lead: newLead },
        });
    }
    catch (error) {
        console.error('创建线索错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo, tags, notes, score } = req.body;
        const leadIndex = mockLeads.findIndex(l => l.id === id);
        if (leadIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '线索不存在',
            });
        }
        mockLeads[leadIndex] = {
            ...mockLeads[leadIndex],
            status: status || mockLeads[leadIndex].status,
            assignedTo: assignedTo !== undefined ? assignedTo : mockLeads[leadIndex].assignedTo,
            tags: tags || mockLeads[leadIndex].tags,
            notes: notes || mockLeads[leadIndex].notes,
            score: score !== undefined ? score : mockLeads[leadIndex].score,
            updatedAt: new Date(),
        };
        res.json({
            success: true,
            message: '更新线索成功',
            data: { lead: mockLeads[leadIndex] },
        });
    }
    catch (error) {
        console.error('更新线索错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.put('/:id/assign', (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;
        const leadIndex = mockLeads.findIndex(l => l.id === id);
        if (leadIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '线索不存在',
            });
        }
        mockLeads[leadIndex].assignedTo = assignedTo;
        mockLeads[leadIndex].status = 'contacted';
        mockLeads[leadIndex].updatedAt = new Date();
        res.json({
            success: true,
            message: '分配线索成功',
            data: { lead: mockLeads[leadIndex] },
        });
    }
    catch (error) {
        console.error('分配线索错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
router.get('/stats/overview', (req, res) => {
    try {
        const total = mockLeads.length;
        const newLeads = mockLeads.filter(l => l.status === 'new').length;
        const contacted = mockLeads.filter(l => l.status === 'contacted').length;
        const qualified = mockLeads.filter(l => l.status === 'qualified').length;
        const converted = mockLeads.filter(l => l.status === 'converted').length;
        const highScore = mockLeads.filter(l => l.score >= 7).length;
        res.json({
            success: true,
            message: '获取线索统计成功',
            data: {
                total,
                new: newLeads,
                contacted,
                qualified,
                converted,
                highScore,
                conversionRate: total > 0 ? (converted / total * 100).toFixed(2) : 0,
            },
        });
    }
    catch (error) {
        console.error('获取线索统计错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误',
        });
    }
});
module.exports = router;
//# sourceMappingURL=leads.js.map