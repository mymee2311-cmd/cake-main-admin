import React, { useState } from 'react';
import { Table, Tag, Button, message, Space, Popconfirm, Alert } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

const STATUS_MAP = {
  pending_payment: { text: '💰 Chờ nhận tiền', color: 'pink' },
  pending: { text: '⏳ Chờ xác nhận', color: 'orange' },
  confirmed: { text: '✅ Đã xác nhận', color: 'blue' },
  delivering: { text: '🚚 Đang giao', color: 'cyan' },
  completed: { text: '🎉 Hoàn thành', color: 'green' },
  cancelled: { text: '❌ Đã hủy', color: 'red' },
};

const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

const formatDate = (d) => {
  if (!d) return '';
  const date = new Date(d);
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} ${hh}:${mi}`;
};

export default function Orders() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['owner-orders'],
    queryFn: () => api.get('/api/orders').then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) =>
      api.put(`/api/orders/${id}/status`, { status }),
    onSuccess: () => {
      message.success('Đã cập nhật trạng thái');
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
    },
    onError: (err) => message.error(err.message),
  });

  const confirmPayment = useMutation({
    mutationFn: (id) => api.put(`/api/orders/${id}/confirm-payment`),
    onSuccess: () => {
      message.success('Đã xác nhận nhận tiền!');
      queryClient.invalidateQueries({ queryKey: ['owner-orders'] });
    },
    onError: (err) => message.error(err.message),
  });

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'order_code',
      key: 'code',
      render: (v, r) => (
        <div>
          <b style={{ color: '#438A9C' }}>{v || `#${r.id}`}</b>
          <div style={{ fontSize: 11, color: '#89A5AA' }}>
            {formatDate(r.created_at)}
          </div>
        </div>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (_, r) => (
        <div>
          <div>{r.customer_name || 'Khách'}</div>
          <div style={{ fontSize: 11, color: '#89A5AA' }}>
            {r.customer_phone || ''}
          </div>
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (v) => <b style={{ color: '#FF5A5F' }}>{formatPrice(v)}</b>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (s) => {
        const info = STATUS_MAP[s] || { text: s, color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, order) => (
        <Space wrap>
          {order.status === 'pending_payment' && (
            <Popconfirm
              title="Đã nhận được tiền?"
              onConfirm={() => confirmPayment.mutate(order.id)}
            >
              <Button type="primary" size="small" style={{ background: '#D6336C' }}>
                💰 Đã nhận tiền
              </Button>
            </Popconfirm>
          )}

          {order.status === 'pending' && (
            <Button
              type="primary"
              size="small"
              onClick={() => updateStatus.mutate({ id: order.id, status: 'confirmed' })}
            >
              Xác nhận
            </Button>
          )}

          {order.status === 'confirmed' && (
            <Button
              size="small"
              style={{ color: '#4A6DB5', borderColor: '#4A6DB5' }}
              onClick={() => updateStatus.mutate({ id: order.id, status: 'delivering' })}
            >
              Bắt đầu giao
            </Button>
          )}

          {order.status === 'delivering' && (
            <Button
              type="primary"
              size="small"
              style={{ background: '#4D9B68' }}
              onClick={() => updateStatus.mutate({ id: order.id, status: 'completed' })}
            >
              Hoàn thành
            </Button>
          )}

          {(order.status === 'pending' || order.status === 'pending_payment') && (
            <Popconfirm
              title="Hủy đơn này?"
              onConfirm={() => updateStatus.mutate({ id: order.id, status: 'cancelled' })}
            >
              <Button danger size="small">Hủy</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const filteredOrders =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  if (error) {
    return (
      <Alert
        type="error"
        message="Không thể tải đơn hàng"
        description={error.message}
        showIcon
      />
    );
  }

  return (
    <div>
      <h1 style={{ color: '#356F7C', marginBottom: 20, fontSize: 24 }}>
        Quản lý đơn hàng
      </h1>

      <Space wrap style={{ marginBottom: 16 }}>
        <Button onClick={() => setFilter('all')} type={filter === 'all' ? 'primary' : 'default'}>
          Tất cả ({orders.length})
        </Button>
        <Button onClick={() => setFilter('pending_payment')} type={filter === 'pending_payment' ? 'primary' : 'default'}>
          Chờ nhận tiền
        </Button>
        <Button onClick={() => setFilter('pending')} type={filter === 'pending' ? 'primary' : 'default'}>
          Chờ xác nhận
        </Button>
        <Button onClick={() => setFilter('confirmed')} type={filter === 'confirmed' ? 'primary' : 'default'}>
          Đã xác nhận
        </Button>
        <Button onClick={() => setFilter('delivering')} type={filter === 'delivering' ? 'primary' : 'default'}>
          Đang giao
        </Button>
        <Button onClick={() => setFilter('completed')} type={filter === 'completed' ? 'primary' : 'default'}>
          Hoàn thành
        </Button>
      </Space>

      <Table
        dataSource={filteredOrders}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}