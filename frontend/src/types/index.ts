// LinkBot-AI 类型定义

// ===================
// 基础类型
// ===================
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  code?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ===================
// 用户相关
// ===================
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'operator' | 'viewer';
  tenantId: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'expired';
  expiresAt: string;
  createdAt: string;
}

// ===================
// 渠道相关
// ===================
export type ChannelType = 'douyin' | 'kuaishou' | 'wechat' | 'xiaohongshu';

export interface Channel {
  id: string;
  type: ChannelType;
  name: string;
  accountId: string;
  accountName: string;
  avatar?: string;
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: string;
  config: ChannelConfig;
  createdAt: string;
}

export interface ChannelConfig {
  autoReply: boolean;
  keywords: string[];
  welcomeMessage: string;
  silenceTimeout: number; // 秒
  maxConcurrent: number;
}

// ===================
// 对话相关
// ===================
export interface Conversation {
  id: string;
  channelId: string;
  userId: string;
  userNickname: string;
  userAvatar?: string;
  status: 'active' | 'closed' | 'transferred';
  lastMessageAt: string;
  messageCount: number;
  score: number; // 0-10 分
  tags: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  type: 'user' | 'bot' | 'human';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ===================
// AI 相关
// ===================
export interface Intent {
  id: string;
  name: string;
  keywords: string[];
  response: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'coze' | 'openai' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  config: Record<string, any>;
}

// ===================
// 线索相关
// ===================
export interface Lead {
  id: string;
  conversationId: string;
  channelId: string;
  userId: string;
  userNickname: string;
  phone?: string;
  email?: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  assignedTo?: string;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ===================
// 统计数据
// ===================
export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  avgResponseTime: number;
  satisfactionScore: number;
}

export interface ChannelStats {
  channelId: string;
  channelName: string;
  conversations: number;
  leads: number;
  conversionRate: number;
  avgScore: number;
}

export interface RealtimeData {
  onlineUsers: number;
  activeConversations: number;
  messagesPerMinute: number;
  systemLoad: number;
}

// ===================
// 工作流相关
// ===================
export interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  isActive: boolean;
  version: number;
  createdAt: string;
}

export interface WorkflowTrigger {
  type: 'message' | 'keyword' | 'time' | 'event';
  conditions: Record<string, any>;
}

export interface WorkflowStep {
  id: string;
  type: 'reply' | 'assign' | 'tag' | 'webhook' | 'delay';
  config: Record<string, any>;
  next?: string;
}

// ===================
// 内容安全
// ===================
export interface SensitiveWord {
  id: string;
  word: string;
  category: 'political' | 'pornographic' | 'violence' | 'spam';
  level: 'low' | 'medium' | 'high';
  action: 'block' | 'review' | 'replace';
  replacement?: string;
  isActive: boolean;
}

export interface AuditRecord {
  id: string;
  content: string;
  category: string;
  confidence: number;
  action: 'blocked' | 'passed' | 'reviewed';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// ===================
// 系统管理
// ===================
export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: 'CNY' | 'USD';
  interval: 'month' | 'year';
  features: string[];
  limits: {
    conversations: number;
    channels: number;
    users: number;
    storage: number; // GB
  };
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// ===================
// WebSocket 消息
// ===================
export interface WSMessage {
  type: 'conversation' | 'message' | 'status' | 'notification';
  data: any;
  timestamp: string;
}

export interface ConversationWSMessage extends WSMessage {
  type: 'conversation';
  data: Conversation;
}

export interface MessageWSMessage extends WSMessage {
  type: 'message';
  data: Message;
}

export interface StatusWSMessage extends WSMessage {
  type: 'status';
  data: {
    channelId: string;
    status: 'online' | 'offline' | 'error';
  };
}

export interface NotificationWSMessage extends WSMessage {
  type: 'notification';
  data: {
    title: string;
    message: string;
    level: 'info' | 'warning' | 'error';
  };
}
