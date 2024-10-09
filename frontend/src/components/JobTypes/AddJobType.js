import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createJobType, updateJobType, getJobTypeById } from '../../services/api';

const AddJobType = () => {
    const [form, setForm] = useState({
        name: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            fetchJobType();
        }
    }, [id]);

    const fetchJobType = async () => {
        try {
            const response = await getJobTypeById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch job type', error);
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
                await updateJobType(id, form);
            } else {
                await createJobType(form);
            }
            navigate('/job_types');
        } catch (error) {
            console.error('Failed to save job type', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Job Type' : 'Add New Job Type'}</h3>
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
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/job_types')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddJobType;
