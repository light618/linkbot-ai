import React from 'react';
import { Card, Row, Col, Button, Table, Modal, Form, Input, Select, Switch, Space, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, RobotOutlined, SettingOutlined, ThunderboltOutlined } from '@ant-design/icons';

const ModelsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <ThunderboltOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          大模型设置
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          配置AI大模型参数和智能回复策略
        </p>
      </div>

      <Card 
        title="模型配置" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>全局设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建模型</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <ThunderboltOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>大模型设置功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default ModelsPage;
