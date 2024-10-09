import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTypeOfHall, updateTypeOfHall, getTypeOfHallById } from '../../services/api';

const AddTypeOfHall = () => {
    const [form, setForm] = useState({
        name: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchTypeOfHall();
        }
    }, [id]);

    const fetchTypeOfHall = async () => {
        try {
            const response = await getTypeOfHallById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch type of hall', error);
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
                await updateTypeOfHall(id, form);
            } else {
                await createTypeOfHall(form);
            }
            navigate('/types_of_halls');
        } catch (error) {
            console.error('Failed to save type of hall', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Type of Hall' : 'Add New Type of Hall'}</h3>
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
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/types_of_halls')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddTypeOfHall;
