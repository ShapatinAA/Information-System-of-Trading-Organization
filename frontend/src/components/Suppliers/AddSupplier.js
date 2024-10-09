import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createSupplier, updateSupplier, getSupplierById } from '../../services/api';

const AddSupplier = () => {
    const [form, setForm] = useState({
        name: '',
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchSupplier();
        }
    }, [id]);

    const fetchSupplier = async () => {
        try {
            const response = await getSupplierById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch supplier', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateSupplier(id, form);
            } else {
                await createSupplier(form);
            }
            navigate('/suppliers');
        } catch (error) {
            console.error('Failed to save supplier', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Supplier' : 'Add New Supplier'}</h3>
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
                <Link to="/suppliers" className="btn btn-dark" style={{ marginLeft: '10px' }}>Back</Link>
            </form>
        </div>
    );
};

export default AddSupplier;
