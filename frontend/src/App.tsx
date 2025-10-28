import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// 渠道中心页面
import DouyinPage from './pages/Channels/DouyinPage';
import KuaishouPage from './pages/Channels/KuaishouPage';
import WechatPage from './pages/Channels/WechatPage';
import XiaohongshuPage from './pages/Channels/XiaohongshuPage';
import StatusPage from './pages/Channels/StatusPage';

// 对话管理页面
import ActiveConversations from './pages/Conversations/ActiveConversations';
import AutoReplyPage from './pages/Conversations/AutoReplyPage';
import HandoverPage from './pages/Conversations/HandoverPage';

// AI机器人页面
import IntentsPage from './pages/AI/IntentsPage';
import KnowledgePage from './pages/AI/KnowledgePage';
import ModelsPage from './pages/AI/ModelsPage';

// 线索中心页面
import LeadsList from './pages/Leads/LeadsList';
import RulesPage from './pages/Leads/RulesPage';
import ComponentsPage from './pages/Leads/ComponentsPage';

// 流程编排页面
import DesignerPage from './pages/Workflow/DesignerPage';
import VersionsPage from './pages/Workflow/VersionsPage';

// 数据分析页面
import ChannelsPage from './pages/Analytics/ChannelsPage';
import PerformancePage from './pages/Analytics/PerformancePage';

// 内容安全页面
import SensitiveWordsPage from './pages/Security/SensitiveWordsPage';
import AuditLogsPage from './pages/Security/AuditLogsPage';

// 系统管理页面
import TenantsPage from './pages/System/TenantsPage';
import BillingPage from './pages/System/BillingPage';
import MonitoringPage from './pages/System/MonitoringPage';

import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* 渠道中心 */}
                      <Route path="/channels/douyin" element={<DouyinPage />} />
                      <Route path="/channels/kuaishou" element={<KuaishouPage />} />
                      <Route path="/channels/wechat" element={<WechatPage />} />
                      <Route path="/channels/xiaohongshu" element={<XiaohongshuPage />} />
                      <Route path="/channels/status" element={<StatusPage />} />
                      
                      {/* 对话管理 */}
                      <Route path="/conversations/active" element={<ActiveConversations />} />
                      <Route path="/conversations/auto-reply" element={<AutoReplyPage />} />
                      <Route path="/conversations/handover" element={<HandoverPage />} />
                      
                      {/* AI机器人 */}
                      <Route path="/ai/intents" element={<IntentsPage />} />
                      <Route path="/ai/knowledge" element={<KnowledgePage />} />
                      <Route path="/ai/models" element={<ModelsPage />} />
                      
                      {/* 线索中心 */}
                      <Route path="/leads/list" element={<LeadsList />} />
                      <Route path="/leads/rules" element={<RulesPage />} />
                      <Route path="/leads/form" element={<ComponentsPage />} />
                      
                      {/* 流程编排 */}
                      <Route path="/workflow/design" element={<DesignerPage />} />
                      <Route path="/workflow/versions" element={<VersionsPage />} />
                      
                      {/* 数据分析 */}
                      <Route path="/analytics/dashboard" element={<Dashboard />} />
                      <Route path="/analytics/channels" element={<ChannelsPage />} />
                      <Route path="/analytics/performance" element={<PerformancePage />} />
                      
                      {/* 内容安全 */}
                      <Route path="/security/sensitive-words" element={<SensitiveWordsPage />} />
                      <Route path="/security/audit-logs" element={<AuditLogsPage />} />
                      
                      {/* 系统管理 */}
                      <Route path="/system/tenants" element={<TenantsPage />} />
                      <Route path="/system/billing" element={<BillingPage />} />
                      <Route path="/system/monitoring" element={<MonitoringPage />} />
                      
                      <Route path="/unauthorized" element={<div>权限不足</div>} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
