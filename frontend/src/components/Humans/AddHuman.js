import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createHuman, updateHuman, getHumans } from '../../services/api';

const AddHuman = () => {
    const [form, setForm] = useState({ name: '' });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchHuman();
        }
    }, [id]);

    const fetchHuman = async () => {
        try {
            const response = await getHumans(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch human', error);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateHuman(id, form);
            } else {
                await createHuman(form);
            }
            navigate('/humans');
        } catch (error) {
            console.error('Failed to save human', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Human' : 'Add New Human'}</h3>
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
                <Link to="/humans" className="btn btn-dark" style={{ marginLeft: '10px' }}>Back</Link>
            </form>
        </div>
    );
};

export default AddHuman;
