import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { getSellerOutput, getStaff } from '../../services/api';
import './SellerOutput.css';

const SellerOutput = () => {
    const [criteria, setCriteria] = useState({
        start_date: '',
        end_date: '',
        type_id: ''
    });
    const [outputs, setOutputs] = useState([]);
    const [staffNames, setStaffNames] = useState({});

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const staffResponse = await getStaff();
            const staffMap = staffResponse.data.reduce((acc, staff) => {
                acc[staff.id] = staff.name;  // Assuming each staff object has 'id' and 'name'
                return acc;
            }, {});
            setStaffNames(staffMap);
        } catch (error) {
            console.error('Failed to fetch staff details', error);
        }
    };

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getSellerOutput(criteria);
            setOutputs(response.data);
        } catch (error) {
            console.error('Failed to fetch seller output', error);
            setOutputs([]);
        }
    };

    return (
        <div className="container-fluid seller-output-container">
            <h3>Seller Output</h3>
            <Form onSubmit={handleSubmit}>
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
                <div className="form-group">
                    <label>Type ID (optional):</label>
                    <input
                        type="text"
                        name="type_id"
                        value={criteria.type_id}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            {outputs.length > 0 ? (
                <Table striped bordered hover variant="dark" className="mt-2">
                    <thead>
                    <tr>
                        <th>Staff Id</th>
                        <th>Total Quantity Sold</th>
                        <th>Total Revenue</th>
                    </tr>
                    </thead>
                    <tbody>
                    {outputs.map(output => (
                        <tr key={output.staff_id}>
                            <td>{output.staff_id}</td>
                            <td>{output.total_quantity}</td>
                            <td>{output.total_revenue}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : <p>No output data found for the specified criteria.</p>}
        </div>
    );
};

export default SellerOutput;
