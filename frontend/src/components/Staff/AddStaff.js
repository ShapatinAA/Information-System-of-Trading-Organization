import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createStaff, updateStaff, getStaffById, getHumans, getJobTypes, getOutlets } from '../../services/api';

const AddStaff = () => {
    const [form, setForm] = useState({
        job_type_id: '',
        human_id: '',
        outlet_id: '',
        salary: ''
    });

    const [jobTypes, setJobTypes] = useState([]);
    const [humans, setHumans] = useState([]);
    const [outlets, setOutlets] = useState([]);

    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        fetchLists();
        if (isEditing) {
            fetchStaff();
        }
    }, [id]);

    const fetchLists = async () => {
        try {
            const [jobTypesResponse, humansResponse, outletsResponse] = await Promise.all([
                getJobTypes(),
                getHumans(),
                getOutlets()
            ]);
            setJobTypes(jobTypesResponse.data);
            setHumans(humansResponse.data);
            setOutlets(outletsResponse.data);
        } catch (error) {
            console.error('Failed to fetch lists', error);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await getStaffById(id);
            setForm(response.data);
        } catch (error) {
            console.error('Failed to fetch staff member', error);
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
                await updateStaff(id, form);
            } else {
                await createStaff(form);
            }
            navigate('/staff');
        } catch (error) {
            console.error('Failed to save staff member', error);
        }
    };

    return (
        <div className="container">
            <h3>{isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Type:</label>
                    <select
                        name="job_type_id"
                        value={form.job_type_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Job Type</option>
                        {jobTypes.map(type => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Human:</label>
                    <select
                        name="human_id"
                        value={form.human_id}
                        onChange={handleChange}
                        className="form-control"
                        required
                    >
                        <option value="">Select Human</option>
                        {humans.map(human => (
                            <option key={human.id} value={human.id}>
                                {human.name}
                            </option>
                        ))}
                    </select>
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
                    <label>Salary:</label>
                    <input
                        type="number"
                        step="any"
                        name="salary"
                        value={form.salary}
                        onChange={handleChange}
                        className="form-control"
                        required
                        min="0"
                    />
                </div>
                <button type="submit" className="btn btn-dark">Save</button>
                <button type="button" className="btn btn-dark" style={{ marginLeft: '10px' }} onClick={() => navigate('/staff')}>Cancel</button>
            </form>
        </div>
    );
};

export default AddStaff;
