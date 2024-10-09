import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOutlet, updateOutlet, getOutletById, getTypesOfTradingPlaces, getTypesOfHalls } from '../../services/api';

const AddOutlet = () => {
    const [form, setForm] = useState({
        name: '',
        type_id: '',
        hall_id: '',
        size: '',
        rent_and_utility_payments: ''
    });

    const [types, setTypes] = useState([]);
    const [halls, setHalls] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchLists();
        if (isEditing) {
            fetchOutlet();
        }
    }, [id]);

    const fetchLists = async () => {
        try {
            const [typesResponse, hallsResponse] = await Promise.all([
                getTypesOfTradingPlaces(),
                getTypesOfHalls()
            ]);
            setTypes(typesResponse.data);
            setHalls(hallsResponse.data);
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const fetchOutlet = async () => {
        try {
            const response = await getOutletById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch outlet', error);
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
                await updateOutlet(id, form);
            } else {
                await createOutlet(form);
            }
            navigate('/outlets');
        } catch (error) {
            console.error('Failed to save outlet', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Outlet' : 'Add New Outlet'}</h3>
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
                <div className="form-group">
                    <label>Type:</label>
                    <select
                        name="type_id"
                        value={form.type_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Type</option>
                        {types.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Hall:</label>
                    <select
                        name="hall_id"
                        value={form.hall_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Hall</option>
                        {halls.map(hall => (
                            <option key={hall.id} value={hall.id}>
                                {hall.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Size:</label>
                    <input
                        type="number"
                        step="any"
                        name="size"
                        value={form.size}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <label>Rent & Utility Payments:</label>
                    <input
                        type="number"
                        step="any"
                        name="rent_and_utility_payments"
                        value={form.rent_and_utility_payments}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="0"
                    />
                </div>
                <button type="submit" className="btn btn-dark">Save</button>
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/outlets')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddOutlet;
