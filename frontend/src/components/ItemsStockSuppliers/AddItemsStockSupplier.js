import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItemsStockSupplier, updateItemsStockSupplier, getItemsStockSupplierById, getProducts, getSuppliers } from '../../services/api';

const AddItemsStockSupplier = () => {
    const [form, setForm] = useState({
        product_id: '',
        price: '',
        supplier_id: ''
    });

    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

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
            const [productsResponse, suppliersResponse] = await Promise.all([
                getProducts(),
                getSuppliers()
            ]);
            setProducts(productsResponse.data);
            setSuppliers(suppliersResponse.data);
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const fetchItem = async () => {
        try {
            const response = await getItemsStockSupplierById(id);
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
                await updateItemsStockSupplier(id, form);
            } else {
                await createItemsStockSupplier(form);
            }
            navigate('/items_stock_suppliers');
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
                <button type="submit" className="btn btn-dark">Save</button>
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/items_stock_suppliers')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddItemsStockSupplier;
