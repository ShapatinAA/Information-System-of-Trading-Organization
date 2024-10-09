import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { getOutlets, getOutletProfitability } from '../../services/api';
import './ProfitabilityByCriteria.css';

const ProfitabilityByCriteria = () => {
    const [criteria, setCriteria] = useState({
        outlet_id: '',
        start_date: '',
        end_date: ''
    });
    const [outlets, setOutlets] = useState([]);
    const [profitability, setProfitability] = useState(null);

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

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchProfitability();
    };

    const fetchProfitability = async () => {
        try {
            const response = await getOutletProfitability(criteria);
            setProfitability(response.data);
        } catch (error) {
            console.error('Failed to fetch profitability', error);
        }
    };

    return (
        <div className="container-fluid profitability-container">
            <h3>Outlet Profitability By Criteria</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Outlet:</label>
                    <select
                        name="outlet_id"
                        value={criteria.outlet_id}
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
                    <label>Start Date:</label>
                    <input
                        type="date"
                        name="start_date"
                        value={criteria.start_date}
                        onChange={handleChange}
                        className="form-control"
                        required
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
                        required
                    />
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            {profitability && (
                <div className="mt-4">
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Outlet ID</th>
                            <th>Total Sales</th>
                            <th>Total Overheads</th>
                            <th>Profitability Ratio</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{profitability.outlet_id}</td>
                            <td>{profitability.total_sales}</td>
                            <td>{profitability.total_overheads}</td>
                            <td>{profitability.profitability_ratio}</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default ProfitabilityByCriteria;
