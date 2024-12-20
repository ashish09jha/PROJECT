import React, { useEffect, useState } from 'react';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Button, Modal, Form, Input, message, Table, Space, Popconfirm, Spin } from 'antd';
import { Header } from '../components';

const Customers = () => {
  const [customersData, setCustomersData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [currentRecord, setCurrentRecord] = useState(null);

  // Fetch customers data from API
  const fetchCustomersData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/learner');
      if (response.status === 200 && response.data.success) {
        setCustomersData(response.data.data.learners);
        setFilteredData(response.data.data.learners);
      } else {
        message.error('Failed to fetch customer data');
      }
    } catch (error) {
      console.error('Error fetching customers data:', error);
      message.error('Failed to fetch customer data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCustomersData();
  }, []);

  // Show modal for adding a learner
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal OK button click for adding learner
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const response = await axios.post('http://localhost:8000/api/v1/users/learner', values);

      if (response.status === 201 && response.data.success) {
        message.success(response.data.message);
        setIsModalVisible(false);
        form.resetFields();
        fetchCustomersData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Validation Failed');
      }
    }
  };

  // Handle modal Cancel button click
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle edit modal OK button click
  const handleEditOk = async () => {
    try {
      const values = await editForm.validateFields();
      const response = await axios.put(`http://localhost:8000/api/v1/users/learner/${currentRecord._id}`, values);

      if (response.status === 200 && response.data.success) {
        message.success(response.data.message);
        setIsEditModalVisible(false);
        editForm.resetFields();
        fetchCustomersData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Validation Failed');
      }
    }
  };

  // Handle edit modal Cancel button click
  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  // Show edit modal and set current record
  const showEditModal = (record) => {
    setCurrentRecord(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  // Handle delete selected records
  const handleDelete = async (ids) => {
    try {
      const response = await axios.delete('http://localhost:8000/api/v1/users/learner', { data: { ids } });

      if (response.status === 200 && response.data.success) {
        message.success(response.data.message);
        fetchCustomersData();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting records:', error);
      message.error('Failed to delete records');
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = customersData.filter(customer => customer.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredData(filtered);
  };

  // Table columns definition
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      align: 'center',
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      align: 'center',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      align: 'center',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined style={{ color: 'rgb(3,201,215)' }} />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Are you sure to delete this learner?"
            onConfirm={() => handleDelete([record._id])} // Ensure correct ID reference
            okText="Yes"
            okButtonProps={{
              style: {
                backgroundColor: 'rgb(3,201,215)',
                borderColor: 'rgb(3,201,215)',
              }}}
            cancelText="No"
          >
            <Button type="link" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
      align: 'center',
    },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-lg">
      <Header category="Page" title="Learners" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <Button
          type="primary"
          onClick={showModal}
          style={{
            backgroundColor: 'rgb(3,201,215)',
            borderColor: 'rgb(3,201,215)',
            borderRadius: '4px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
          }}
          icon={<PlusOutlined />}
        >
          Add Learner
        </Button>
        <Input
          placeholder="Search by Name"
          value={searchText}
          onChange={handleSearch}
          style={{ width: '300px' }}
        />
      </div>
      <Modal
        title="Add Learner"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
        centered
        style={{ top: 20 }}
        okButtonProps={{
          style: {
            backgroundColor: 'rgb(3,201,215)',
            borderColor: 'rgb(3,210,215)',
          },
        }}
        cancelButtonProps={{
          style: {
            color: 'rgb(3,201,215)',
            borderColor: 'rgb(3,201,215)',
          },
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!', type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="contact" label="Contact" rules={[{ required: true, message: 'Please input the contact!' }]}>
            <Input placeholder="Enter contact" />
          </Form.Item>
          <Form.Item name="course" label="Course" rules={[{ required: true, message: 'Please input the course!' }]}>
            <Input placeholder="Enter course" />
          </Form.Item>
          <Form.Item name="fee" label="Fee" rules={[{ required: true, message: 'Please input the fee!' }]}>
            <Input placeholder="Enter fee" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Learner"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okText="Submit"
        cancelText="Cancel"
        centered
        style={{ top: 20 }}
        okButtonProps={{
          style: {
            backgroundColor: 'rgb(3,201,215)',
            borderColor: 'rgb(3,210,215)',
          },
        }}
        cancelButtonProps={{
          style: {
            color: 'rgb(3,201,215)',
            borderColor: 'rgb(3,201,215)',
          },
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!', type: 'email' }]}>
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item name="contact" label="Contact" rules={[{ required: true, message: 'Please input the contact!' }]}>
            <Input placeholder="Enter contact" />
          </Form.Item>
          <Form.Item name="course" label="Course" rules={[{ required: true, message: 'Please input the course!' }]}>
            <Input placeholder="Enter course" />
          </Form.Item>
          <Form.Item name="fee" label="Fee" rules={[{ required: true, message: 'Please input the fee!' }]}>
            <Input placeholder="Enter fee" />
          </Form.Item>
        </Form>
      </Modal>
      <Spin spinning={loading}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '30'],
          }}
        />
      </Spin>
    </div>
  );
};

export default Customers;
