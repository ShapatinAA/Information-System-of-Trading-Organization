import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Pagination } from 'react-bootstrap';
import { getOrderItemsByRequest, getRequests } from '../../services/api';
import './OrderItemsByRequest.css';

const OrderItemsByRequest = () => {
    const [criteria, setCriteria] = useState({
        request_id: ''
    });
    const [requests, setRequests] = useState([]);
    const [orderItems, setOrderItems] = useState([]);
    const [totalOrderItems, setTotalOrderItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordPerPage] = useState(5);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await getRequests();
            setRequests(response.data.filter(request => request.status === 'fulfilled'));
        } catch (error) {
            console.error('Failed to fetch requests', error);
        }
    };

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchOrderItems(currentPage);
    };

    const fetchOrderItems = async (page) => {
        try {
            const response = await getOrderItemsByRequest({ ...criteria, page, limit: recordPerPage });
            setOrderItems(response.data);
            setTotalOrderItems(response.data.length);
            setTotalPages(Math.ceil(response.data.length / recordPerPage));
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to fetch order items', error);
        }
    };

    const handlePageChange = (page) => {
        fetchOrderItems(page);
    };

    return (
        <div className="container-fluid order-items-container">
            <h3>Order Items By Request</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Request:</label>
                    <select
                        name="request_id"
                        value={criteria.request_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Request</option>
                        {requests.map(request => (
                            <option key={request.id} value={request.id}>
                                {`Product: ${request.product_id}, Quantity: ${request.quantity}, Outlet: ${request.outlet_id}, Status: ${request.status}`}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            <h4 className="mt-4">Total Order Items: {totalOrderItems}</h4>
            {orderItems.length > 0 && (
                <>
                    <Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Supplier</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.supplier_name}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map(page =>
                            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                                {page + 1}
                            </Pagination.Item>
                        )}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default OrderItemsByRequest;
