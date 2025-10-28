import React from 'react';
import { Card, Row, Col, Button, Table, Modal, Form, Input, Select, Switch, Space, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, SettingOutlined, FormOutlined } from '@ant-design/icons';

const ComponentsPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <FormOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          留资组件
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          管理线索收集表单和留资组件
        </p>
      </div>

      <Card 
        title="留资组件管理" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>全局设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建组件</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <FormOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>留资组件功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default ComponentsPage;
