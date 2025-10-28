import React from 'react';
import { Card, Row, Col, Button, Table, Modal, Form, Input, Select, Switch, Space, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, RobotOutlined, BookOutlined, SettingOutlined } from '@ant-design/icons';

const KnowledgePage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <BookOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          知识图谱 FAQ
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理AI知识库和常见问题解答
        </p>
      </div>

      <Card 
        title="知识库管理" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>全局设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建知识</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <BookOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>知识图谱 FAQ 功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgePage;
