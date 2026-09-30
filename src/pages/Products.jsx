import React, { useState } from 'react';
import {
  Table,
  Tag,
  Alert,
  Card,
  Statistic,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Space,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';

const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + 'đ';

const getCategoryEmoji = (name) => {
  if (!name) return '🌰';
  if (name.includes('quy') || name.includes('Cookies')) return '🍪';
  if (name.includes('mì') || name.includes('chuối')) return '🍞';
  if (name.includes('Croissant')) return '🥐';
  if (name.includes('kem')) return '🍰';
  return '🌰';
};

export default function Products() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/api/products').then((r) => r.data),
  });

  const addProductMutation = useMutation({
    mutationFn: (newProduct) => api.post('/api/products', newProduct),
    onSuccess: () => {
      message.success('Thêm sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
    onError: (err) => {
      message.error(
        'Lỗi khi thêm sản phẩm: ' +
          (err.response?.data?.message || err.message)
      );
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/api/products/${id}`, data),
    onSuccess: () => {
      message.success('Cập nhật sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
    onError: (err) => {
      message.error(
        'Lỗi khi cập nhật: ' + (err.response?.data?.message || err.message)
      );
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/products/${id}`),
    onSuccess: () => {
      message.success('Xóa sản phẩm thành công!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => {
      message.error(
        'Lỗi khi xóa: ' + (err.response?.data?.message || err.message)
      );
    },
  });

  const openAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    form.setFieldsValue({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category_name: product.category_name,
      description: product.description,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: values });
    } else {
      addProductMutation.mutate(values);
    }
  };

  const columns = [
    {
      title: 'Ảnh',
      key: 'image',
      width: 70,
      render: (_, r) => (
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            background: '#EAF8FB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
          }}
        >
          {getCategoryEmoji(r.category_name)}
        </div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (v) => <b style={{ color: '#438A9C' }}>{v}</b>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_name',
      key: 'category',
      render: (v) => <Tag color="cyan">{v || 'Khác'}</Tag>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (v) => <b style={{ color: '#FF5A5F' }}>{formatPrice(v)}</b>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (v) => (
        <Tag color={v > 0 ? 'green' : 'red'}>
          {v > 0 ? `${v} sản phẩm` : 'Hết hàng'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            styles={{ content: {color: '#438A9C' }}}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Bạn có chắc muốn xóa "${record.name}"?`}
            onConfirm={() => deleteProductMutation.mutate(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Alert
        type="error"
        message="Không thể tải sản phẩm"
        description={error.message}
        showIcon
      />
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h1 style={{ color: '#356F7C', margin: 0, fontSize: 24 }}>
          Quản lý sản phẩm
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openAddModal}
          styles={{content: { backgroundColor: '#438A9C', borderColor: '#438A9C' }} }
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={products.length}
              styles={{content: {color: '#438A9C', fontWeight: 800 }} }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Còn hàng"
              value={products.filter((p) => p.stock > 0).length}
              styles={{ content: {color: '#4D9B68', fontWeight: 800 }}}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hết hàng"
              value={products.filter((p) => p.stock <= 0).length}
              styles={{ content: {color: '#FF5A5F', fontWeight: 800 }}}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Danh mục"
              value={new Set(products.map((p) => p.category_name)).size}
              styles={{ content: {color: '#438A9C', fontWeight: 800 }}}
            />
          </Card>
        </Col>
      </Row>

      <Table
        dataSource={products}
        columns={columns}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={
          addProductMutation.isLoading || updateProductMutation.isLoading
        }
        okText={editingProduct ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
          >
            <Input placeholder="Ví dụ: Bánh kem dâu" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá bán (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={1000}
              placeholder="50000"
            />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Số lượng tồn kho"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="10" />
          </Form.Item>

          <Form.Item
            name="category_name"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
          >
            <Select placeholder="Chọn danh mục">
              <Select.Option value="Bánh quy">Bánh quy</Select.Option>
              <Select.Option value="Bánh mì">Bánh mì</Select.Option>
              <Select.Option value="Croissant">Croissant</Select.Option>
              <Select.Option value="Bánh kem">Bánh kem</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về sản phẩm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}