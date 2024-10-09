import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItemsStockOutlet, updateItemsStockOutlet, getItemsStockOutletById, getProducts, getOutlets } from '../../services/api';

const AddItemsStockOutlet = () => {
    const [form, setForm] = useState({
        product_id: '',
        price: '',
        outlet_id: '',
        quantity: ''
    });

    const [products, setProducts] = useState([]);
    const [outlets, setOutlets] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchLists();
        if (isEditing) {
            fetchItem();
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

    const fetchItem = async () => {
        try {
            const response = await getItemsStockOutletById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch item', error);
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
                await updateItemsStockOutlet(id, form);
            } else {
                await createItemsStockOutlet(form);
            }
            navigate('/items_stock_outlets');
        } catch (error) {
            console.error('Failed to save item', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Item' : 'Add New Item'}</h3>
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
                    <label>Price:</label>
                    <input
                        type="number"
                        step="any"
                        name="price"
                        value={form.price}
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
                <button type="submit" className="btn btn-dark">Save</button>
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/items_stock_outlets')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddItemsStockOutlet;
