import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTypeOfTradingPlace, updateTypeOfTradingPlace, getTypeOfTradingPlaceById } from '../../services/api';

const AddTypeOfTradingPlace = () => {
    const [form, setForm] = useState({
        name: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchTypeOfTradingPlace();
        }
    }, [id]);

    const fetchTypeOfTradingPlace = async () => {
        try {
            const response = await getTypeOfTradingPlaceById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch type of trading place', error);
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
                await updateTypeOfTradingPlace(id, form);
            } else {
                await createTypeOfTradingPlace(form);
            }
            navigate('/types_of_trading_places');
        } catch (error) {
            console.error('Failed to save type of trading place', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Type of Trading Place' : 'Add New Type of Trading Place'}</h3>
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
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/types_of_trading_places')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddTypeOfTradingPlace;
