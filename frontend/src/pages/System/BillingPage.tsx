import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { SettingOutlined, PlusOutlined, DollarOutlined } from '@ant-design/icons';

const BillingPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <DollarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          计费账单
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理系统计费和账单信息
        </p>
      </div>

      <Card 
        title="账单管理" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建账单</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <DollarOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>计费账单功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default BillingPage;
