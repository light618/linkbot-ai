import React from 'react';
import { Card, Row, Col, Button, Space } from 'antd';
import { BarChartOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';

const PerformancePage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
          <BarChartOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
          客服绩效
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666' }}>
          分析客服团队的工作绩效和效率
        </p>
      </div>

      <Card 
        title="客服绩效分析" 
        extra={
          <Space>
            <Button icon={<SettingOutlined />}>设置</Button>
            <Button type="primary" icon={<PlusOutlined />}>新建报告</Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <BarChartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <p>客服绩效分析功能正在开发中</p>
        </div>
      </Card>
    </div>
  );
};

export default PerformancePage;
