import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { SettingOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';

const TenantsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          租户管理
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理系统租户和权限配置
        </p>
      </div>

      <Card 
        title="租户列表" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建租户</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <UserOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>租户管理功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default TenantsPage;
