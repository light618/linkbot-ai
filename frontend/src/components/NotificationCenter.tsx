import React, { useState, useEffect } from 'react';
import { Alert, Button, Space, Badge } from 'antd';
import { BellOutlined, CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'info',
      title: '系统更新',
      message: 'AI模型已更新至最新版本，响应速度提升20%',
      timestamp: '5分钟前',
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: '抖音渠道异常',
      message: '检测到抖音API响应超时，请检查网络连接',
      timestamp: '10分钟前',
      read: false,
    },
    {
      id: '3',
      type: 'success',
      title: '新线索分配',
      message: '12个新线索已自动分配给销售团队',
      timestamp: '1小时前',
      read: true,
    },
  ]);

  const [visible, setVisible] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getAlertType = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button 
        type="text" 
        icon={<BellOutlined />}
        onClick={() => setVisible(!visible)}
        style={{ position: 'relative' }}
      >
        {unreadCount > 0 && (
          <Badge 
            count={unreadCount} 
            size="small"
            style={{ 
              position: 'absolute',
              top: '-8px',
              right: '-8px'
            }}
          />
        )}
      </Button>

      {visible && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '0',
          width: '320px',
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <div style={{ 
            padding: '12px 16px', 
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>通知中心</span>
            <Space>
              <Button 
                type="link" 
                size="small" 
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                全部已读
              </Button>
              <Button 
                type="text" 
                size="small" 
                icon={<CloseOutlined />}
                onClick={() => setVisible(false)}
              />
            </Space>
          </div>

          <div style={{ padding: '8px' }}>
            {notifications.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '20px', 
                color: '#999' 
              }}>
                暂无通知
              </div>
            ) : (
              notifications.map((notification) => (
                <Alert
                  key={notification.id}
                  message={
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: notification.read ? 'normal' : 'bold',
                          marginBottom: '4px'
                        }}>
                          {notification.title}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#666',
                          marginBottom: '4px'
                        }}>
                          {notification.message}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#999' 
                        }}>
                          {notification.timestamp}
                        </div>
                      </div>
                      <Space size="small">
                        {!notification.read && (
                          <Button 
                            type="link" 
                            size="small"
                            onClick={() => markAsRead(notification.id)}
                          >
                            已读
                          </Button>
                        )}
                        <Button 
                          type="text" 
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={() => removeNotification(notification.id)}
                        />
                      </Space>
                    </div>
                  }
                  type={getAlertType(notification.type)}
                  showIcon={false}
                  style={{ 
                    marginBottom: '8px',
                    opacity: notification.read ? 0.7 : 1
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
