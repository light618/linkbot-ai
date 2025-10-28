import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { ForkOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';

const DesignerPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <ForkOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          画布设计
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          可视化流程设计工具
        </p>
      </div>

      <Card 
        title="流程画布" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建流程</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <ForkOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>流程画布设计功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default DesignerPage;
