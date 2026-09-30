import React from 'react';
import { Layout as AntLayout, Menu, theme, Avatar, Space, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = AntLayout;

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Tổng quan' },
    { key: '/orders', icon: <ShoppingCartOutlined />, label: 'Đơn hàng' },
    { key: '/products', icon: <AppstoreOutlined />, label: 'Sản phẩm' },
    { key: '/categories', icon: <TagsOutlined />, label: 'Danh mục' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={230} style={{ borderRight: '1px solid #E7F2F4' }}>
        <div
          style={{
            padding: '20px 16px',
            fontSize: 20,
            fontWeight: 800,
            color: '#438A9C',
            borderBottom: '1px solid #E7F2F4',
            marginBottom: 8,
          }}
        >
          🧁 Mee Bakery
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 'none' }}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            borderBottom: '1px solid #E7F2F4',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, color: '#356F7C' }}>
            Quản trị cửa hàng
          </div>

          <Space>
            <Avatar style={{ background: '#75B9C8' }} icon={<UserOutlined />} />
            <span style={{ color: '#438A9C', fontWeight: 600 }}>My</span>
            <Button
              type="text"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: 20,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}