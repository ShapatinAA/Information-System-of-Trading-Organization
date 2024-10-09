import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { getSellerOutputByOutlet, getOutlets, getOutletData } from '../../services/api';
import './SellerOutputByOutlet.css';

const SellerOutputByOutlet = () => {
    const [criteria, setCriteria] = useState({
        staff_id: '',
        outlet_id: '',
        start_date: '',
        end_date: ''
    });
    const [outputs, setOutputs] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [staff, setStaff] = useState([]);

    useEffect(() => {
        fetchOutlets();
    }, []);

    const fetchOutlets = async () => {
        try {
            const response = await getOutlets();
            setOutlets(response.data);
        } catch (error) {
            console.error('Failed to fetch outlets', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setCriteria({ ...criteria, [name]: value });

        if (name === 'outlet_id') {
            await fetchOutletData(value);
        }
    };

    const fetchOutletData = async (outletId) => {
        if (!outletId) {
            setStaff([]);
            return;
        }
        try {
            const response = await getOutletData({ outlet_id: outletId });
            setStaff(response.data.staff);  // Assuming the response contains a staff array
        } catch (error) {
            console.error('Failed to fetch staff for outlet', error);
            setStaff([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getSellerOutputByOutlet(criteria);
            setOutputs(response.data);
        } catch (error) {
            console.error('Failed to fetch seller output by outlet', error);
            setOutputs([]);
        }
    };

    return (
        <div className="container-fluid seller-output-by-outlet-container">
            <h3>Seller Output by Outlet</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Outlet:</label>
                    <select
                        name="outlet_id"
                        value={criteria.outlet_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Outlet</option>
                        {outlets.map((outlet) => (
                            <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Staff:</label>
                    <select
                        name="staff_id"
                        value={criteria.staff_id}
                        onChange={handleChange}
                        className="form-control"
                        disabled={!criteria.outlet_id}
                    >
                        <option value="">Select Staff</option>
                        {staff.map((member) => (
                            <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start_date"
                        value={criteria.start_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>End Date:</label>
                    <input
                        type="date"
                        name="end_date"
                        value={criteria.end_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            {outputs.length > 0 && (
                <Table striped bordered hover variant="dark" className="mt-2">
                    <thead>
                    <tr>
                        <th>Staff Name</th>
                        <th>Total Quantity Sold</th>
                        <th>Total Revenue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {outputs.map(output => (
                        <tr key={output.staff_id}>
                            <td>{staff.find(s => s.id === output.staff_id)?.name || 'Unknown Staff'}</td>
                            <td>{output.total_quantity}</td>
                            <td>{output.total_revenue}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default SellerOutputByOutlet;
