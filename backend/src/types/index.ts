// LinkBot-AI 后端类型定义

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

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  role: 'admin' | 'operator' | 'viewer';
  tenantId: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export type ChannelType = 'douyin' | 'kuaishou' | 'wechat' | 'xiaohongshu';

export interface Channel {
  id: string;
  tenantId: string;
  type: ChannelType;
  name: string;
  accountId: string;
  accountName: string;
  avatar?: string;
  status: 'online' | 'offline' | 'error';
  lastHeartbeat: Date;
  config: ChannelConfig;
  createdAt: Date;
}

export interface ChannelConfig {
  autoReply: boolean;
  keywords: string[];
  welcomeMessage: string;
  silenceTimeout: number;
  maxConcurrent: number;
}

export interface Conversation {
  id: string;
  tenantId: string;
  channelId: string;
  userId: string;
  userNickname: string;
  userAvatar?: string;
  status: 'active' | 'closed' | 'transferred';
  lastMessageAt: Date;
  messageCount: number;
  score: number;
  tags: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  tenantId: string;
  conversationId: string;
  type: 'user' | 'bot' | 'human';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Lead {
  id: string;
  tenantId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Intent {
  id: string;
  tenantId: string;
  name: string;
  keywords: string[];
  response: string;
  priority: number;
  isActive: boolean;
  createdAt: Date;
}

export interface AIModel {
  id: string;
  tenantId: string;
  name: string;
  provider: 'coze' | 'openai' | 'custom';
  model: string;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  config: Record<string, any>;
}

export interface DashboardStats {
  totalConversations: number;
  activeConversations: number;
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  avgResponseTime: number;
  satisfactionScore: number;
}

export interface RealtimeData {
  onlineUsers: number;
  activeConversations: number;
  messagesPerMinute: number;
  systemLoad: number;
}

export interface SensitiveWord {
  id: string;
  tenantId: string;
  word: string;
  category: 'political' | 'pornographic' | 'violence' | 'spam';
  level: 'low' | 'medium' | 'high';
  action: 'block' | 'review' | 'replace';
  replacement?: string;
  isActive: boolean;
}

export interface AuditRecord {
  id: string;
  tenantId: string;
  content: string;
  category: string;
  confidence: number;
  action: 'blocked' | 'passed' | 'reviewed';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

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
    storage: number;
  };
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  tenantId: string;
  iat: number;
  exp: number;
}

// 请求扩展
export interface AuthenticatedRequest extends Request {
  user?: User;
  tenantId?: string;
}
