import React from 'react';
import { Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export default function Dashboard() {
  const {
    data: orders = [],
    isLoading: loadingOrders,
    error: errorOrders,
  } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: () => api.get('/api/orders').then((r) => r.data),
  });

  const {
    data: products = [],
    isLoading: loadingProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/api/products').then((r) => r.data),
  });

  const loading = loadingOrders || loadingProducts;
  const error = errorOrders || errorProducts;

  const revenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const uniqueCustomers = new Set(
    orders.map((o) => o.customer_phone).filter(Boolean)
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#7B9EA5' }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Không thể kết nối máy chủ"
        description={error.message}
        showIcon
      />
    );
  }

  return (
    <div>
      <h1 style={{ color: '#356F7C', marginBottom: 24, fontSize: 24 }}>
        Tổng quan cửa hàng
      </h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={revenue}
              suffix="đ"
              prefix={<DollarOutlined />}
              Style={{ color: '#438A9C', fontWeight: 800 }}
              formatter={(v) => Number(v).toLocaleString('vi-VN')}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={orders.length}
              prefix={<ShoppingCartOutlined />}
              Style={{ color: '#438A9C', fontWeight: 800 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Sản phẩm"
              value={products.length}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#438A9C', fontWeight: 800 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách hàng"
              value={uniqueCustomers.size}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#438A9C', fontWeight: 800 }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }} title="💡 Hướng dẫn">
        <p>• <b>Đơn hàng</b>: xem và cập nhật trạng thái đơn</p>
        <p>• <b>Sản phẩm</b>: thêm, sửa, xóa bánh</p>
        <p>• <b>Danh mục</b>: phân loại bánh</p>
      </Card>
    </div>
  );
}