import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createRequest, updateRequest, getRequestById, getProducts, getOutlets } from '../../services/api';

const AddRequest = () => {
    const [form, setForm] = useState({
        product_id: '',
        quantity: '',
        outlet_id: '',
        status: 'pending',
        date: ''
    });

    const [products, setProducts] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const statusOptions = ['pending'];

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchLists();
        if (isEditing) {
            fetchRequest();
        }
    }, [id]);

    const fetchLists = async () => {
        try {
            const [productsResponse, outletsResponse] = await Promise.all([
                getProducts(),
                getOutlets()
            ]);
            setProducts(productsResponse.data);
            setOutlets(outletsResponse.data);
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const fetchRequest = async () => {
        try {
            const response = await getRequestById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch request', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateRequest(id, form);
            } else {
                await createRequest(form);
            }
            navigate('/requests');
        } catch (error) {
            console.error('Failed to save request', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Request' : 'Add New Request'}</h3>
            <form onSubmit={handleSubmit}>
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
                    <label>Outlet:</label>
                    <select
                        name="outlet_id"
                        value={form.outlet_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Outlet</option>
                        {outlets.map(outlet => (
                            <option key={outlet.id} value={outlet.id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Status:</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status}
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
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/requests')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddRequest;
