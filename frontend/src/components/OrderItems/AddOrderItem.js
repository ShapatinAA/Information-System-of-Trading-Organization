import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrderItem, updateOrderItem, getOrderItemById, getRequestData, getPendingRequests } from '../../services/api';

const AddOrderItem = () => {
    const [form, setForm] = useState({
        request_id: '',
        product_id: '',
        quantity: '',
        supplier_id: '',
        date: ''
    });

    const [requests, setRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchRequests();
        if (isEditing) {
            fetchOrderItem();
        }
    }, [id]);

    const fetchRequests = async () => {
        try {
            const response = await getPendingRequests();
            setRequests(response.data.requests);
        } catch (error) {
            console.error('Failed to fetch pending requests', error);
        }
    };

    const fetchOrderItem = async () => {
        try {
            const response = await getOrderItemById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch order item', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'request_id') {
            fetchRequestData(value);
        }
    };

    const fetchRequestData = async (requestId) => {
        try {
            const response = await getRequestData(requestId);
            const { request, products, suppliers } = response.data;
            setProducts(products);
            setSuppliers(suppliers);
            setForm(form => ({
                ...form,
                request_id: requestId,
                product_id: request.product_id,
                quantity: request.quantity
            }));
        } catch (error) {
            console.error('Failed to fetch request data', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateOrderItem(id, form);
            } else {
                await createOrderItem(form);
            }
            navigate('/order_items');
        } catch (error) {
            console.error('Failed to save order item', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Order Item' : 'Add New Order Item'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Request:</label>
                    <select
                        name="request_id"
                        value={form.request_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Request</option>
                        {requests.map(request => (
                            <option key={request.id} value={request.id}>
                                {`${request.product_name} - ${request.quantity} - ${request.outlet_name}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Product:</label>
                    <select
                        name="product_id"
                        value={form.product_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label>Supplier:</label>
                    <select
                        name="supplier_id"
                        value={form.supplier_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-dark">Save</button>
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/order_items')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddOrderItem;
