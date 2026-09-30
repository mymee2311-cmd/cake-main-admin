import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (values) => {
    setLoading(true);

    setTimeout(() => {
      if (values.phone && values.password) {
        localStorage.setItem('token', 'demo-token-' + Date.now());
        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        message.error('Vui lòng nhập đầy đủ thông tin');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#E5F7FB',
        padding: 20,
      }}
    >
      <Card
        style={{ width: '100%', maxWidth: 420, boxShadow: '0 8px 24px rgba(117,185,200,0.15)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              background: '#EAF8FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: 40,
            }}
          >
            🧁
          </div>
          <h1 style={{ color: '#438A9C', fontSize: 24, fontWeight: 800 }}>
            Mee Bakery Admin
          </h1>
          <p style={{ color: '#7B9EA5', marginTop: 6 }}>
            Đăng nhập để quản lý cửa hàng
          </p>
        </div>

        <Form layout="vertical" onFinish={handleLogin} size="large">
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nhập số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              icon={<ShopOutlined />}
              style={{ background: '#438A9C', borderColor: '#438A9C' }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', color: '#89A5AA', fontSize: 12 }}>
          Demo: nhập bất kỳ số điện thoại và mật khẩu
        </div>
      </Card>
    </div>
  );
}