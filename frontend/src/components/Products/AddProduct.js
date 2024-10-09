import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductById } from '../../services/api';

const AddProduct = () => {
    const [form, setForm] = useState({
        name: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await getProductById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch product', error);
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
                await updateProduct(id, form);
            } else {
                await createProduct(form);
            }
            navigate('/products');
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-dark">Save</button>
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/products')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddProduct;
