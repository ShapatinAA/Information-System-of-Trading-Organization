import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createTransfer, updateTransfer, getTransferById, getOutlets, getItemsByOutlet } from '../../services/api';

const AddTransfer = () => {
    const [form, setForm] = useState({
        outlet_id_from: '',
        outlet_id_to: '',
        product_id: '',
        amount: '',
        status: 'pending',
        date: ''
    });

    const [outlets, setOutlets] = useState([]);
    const [products, setProducts] = useState([]);
    const [productStock, setProductStock] = useState({});
    const [statuses] = useState(['pending', 'fulfilled', 'declined']);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchOutlets();
        if (isEditing) {
            fetchTransfer();
        }
    }, [id]);

    const fetchOutlets = async () => {
        try {
            const response = await getOutlets();
            setOutlets(response.data);
        } catch (error) {
            console.error('Failed to fetch outlets', error);
        }
    };

    const fetchTransfer = async () => {
        try {
            const response = await getTransferById(id);
            setForm(response.data);
            await fetchProducts(response.data.outlet_id_from);
        } catch (error) {
            console.error('Failed to fetch transfer', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (name === 'outlet_id_from') {
            await fetchProducts(value);
        }
    };

    const fetchProducts = async (outletId) => {
        try {
            const response = await getItemsByOutlet(outletId);
            const productsData = response.data;
            setProducts(productsData);

            const productStockTemp = {};
            productsData.forEach(product => {
                productStockTemp[product.id] = product.quantity;
            });
            setProductStock(productStockTemp);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleAmountChange = (e) => {
        const { value } = e.target;
        const maxAmount = productStock[form.product_id] || 0;
        if (parseFloat(value) <= maxAmount && parseFloat(value) >= 0) {
            setForm({ ...form, amount: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateTransfer(id, form);
            } else {
                await createTransfer(form);
            }
            navigate('/transfers');
        } catch (error) {
            console.error('Failed to save transfer', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Transfer' : 'Add New Transfer'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>From Outlet:</label>
                    <select
                        name="outlet_id_from"
                        value={form.outlet_id_from}
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
                    <label>To Outlet:</label>
                    <select
                        name="outlet_id_to"
                        value={form.outlet_id_to}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={!form.outlet_id_from}
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
                    <label>Product:</label>
                    <select
                        name="product_id"
                        value={form.product_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                        disabled={!form.outlet_id_from}
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
                    <label>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleAmountChange}
                        className="form-control"
                        required
                        max={productStock[form.product_id] || 0}
                        min="0"
                    />
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
                        <option value="">Select Status</option>
                        {statuses.map(status => (
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
                <Link to="/transfers" className="btn btn-dark" style={{ marginLeft: '10px' }}>Back</Link>
            </form>
        </div>
    );
};

export default AddTransfer;
