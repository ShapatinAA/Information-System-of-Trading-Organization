import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Pagination } from 'react-bootstrap';
import { getOutletTurnover, getTypesOfTradingPlaces } from '../../services/api';
import './OutletTurnover.css';

const OutletTurnover = () => {
    const [criteria, setCriteria] = useState({
        start_date: '',
        end_date: '',
        type_id: ''
    });
    const [typesOfTradingPlaces, setTypesOfTradingPlaces] = useState({});
    const [turnoverData, setTurnoverData] = useState([]);
    const [totalTurnover, setTotalTurnover] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordPerPage] = useState(5);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const typesResponse = await getTypesOfTradingPlaces();
            setTypesOfTradingPlaces(typesResponse.data.reduce((acc, type) => ({ ...acc, [type.id]: type }), {}));
        } catch (error) {
            console.error('Failed to fetch initial data', error);
        }
    };

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchTurnoverData(currentPage);
    };

    const fetchTurnoverData = async (page) => {
        try {
            const response = await getOutletTurnover({ ...criteria, page, limit: recordPerPage });
            if (response.data.message) {
                setMessage(response.data.message);
                setTurnoverData([]);
                setTotalTurnover(0);
                setTotalPages(0);
            } else {
                setMessage('');
                setTurnoverData(response.data);
                setTotalTurnover(response.data.length);
                setTotalPages(Math.ceil(response.data.length / recordPerPage));
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Failed to fetch turnover data', error);
        }
    };

    const handlePageChange = (page) => {
        fetchTurnoverData(page);
    };

    return (
        <div className="container-fluid turnover-container">
            <h3>Outlet Turnover</h3>
            <Form onSubmit={handleSubmit}>
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
                <div className="form-group">
                    <label>Type of Trading Place (optional):</label>
                    <select
                        name="type_id"
                        value={criteria.type_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Type</option>
                        {Object.entries(typesOfTradingPlaces).map(([id, type]) => (
                            <option key={id} value={id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            <h4 className="mt-4">Total Turnover: {totalTurnover}</h4>
            {message && <div className="alert alert-info mt-4">{message}</div>}
            {turnoverData.length > 0 && !message && (
                <>
                    <Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>Outlet Name</th>
                            <th>Total Quantity</th>
                            <th>Total Turnover</th>
                        </tr>
                        </thead>
                        <tbody>
                        {turnoverData.map(outlet => (
                            <tr key={outlet.outlet_id}>
                                <td>{outlet.outlet_name}</td>
                                <td>{outlet.total_quantity}</td>
                                <td>{outlet.total_turnover}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages).keys()].map(page =>
                            <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                                {page + 1}
                            </Pagination.Item>
                        )}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default OutletTurnover;
