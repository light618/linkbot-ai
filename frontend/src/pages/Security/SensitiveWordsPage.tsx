import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { SafetyOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';

const SensitiveWordsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <SafetyOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          敏感词库
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理敏感词库和内容审核规则
        </p>
      </div>

      <Card 
        title="敏感词管理" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>添加敏感词</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <SafetyOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>敏感词库管理功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default SensitiveWordsPage;
