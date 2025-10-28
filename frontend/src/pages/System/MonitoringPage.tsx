import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { SettingOutlined, PlusOutlined, MonitorOutlined } from '@ant-design/icons';

const MonitoringPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <MonitorOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          监控告警
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          系统监控和告警管理
        </p>
      </div>

      <Card 
        title="监控中心" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建告警</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <MonitorOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>监控告警功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default MonitoringPage;
