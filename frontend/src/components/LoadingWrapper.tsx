import React from 'react';
import { Spin, Alert, Button, Space } from 'antd';
import { ReloadOutlined, WarningOutlined } from '@ant-design/icons';

interface LoadingWrapperProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ 
  loading, 
  error, 
  onRetry, 
  children 
}) => {
  if (error) {
    return (
      <Alert
        message="数据加载失败"
        description={error}
        type="error"
        showIcon
        action={
          onRetry && (
            <Button size="small" danger onClick={onRetry} icon={<ReloadOutlined />}>
              重试
            </Button>
          )
        }
      />
    );
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingWrapper;
