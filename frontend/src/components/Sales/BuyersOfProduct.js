import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Pagination } from 'react-bootstrap';
import { getBuyersOfProduct, getProducts, getOutlets, getTypesOfTradingPlaces } from '../../services/api';
import './BuyersOfProduct.css';

const BuyersOfProduct = () => {
    const [criteria, setCriteria] = useState({
        product_id: '',
        start_date: '',
        end_date: '',
        outlet_id: '',
        type_id: ''
    });
    const [products, setProducts] = useState({});
    const [outlets, setOutlets] = useState({});
    const [typesOfTradingPlaces, setTypesOfTradingPlaces] = useState({});
    const [buyers, setBuyers] = useState([]);
    const [totalBuyers, setTotalBuyers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordPerPage] = useState(5);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [productsResponse, outletsResponse, typesResponse] = await Promise.all([
                getProducts(),
                getOutlets(),
                getTypesOfTradingPlaces()
            ]);
            setProducts(productsResponse.data.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}));
            setOutlets(outletsResponse.data.reduce((acc, outlet) => ({ ...acc, [outlet.id]: outlet }), {}));
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
        fetchBuyers(currentPage);
    };

    const fetchBuyers = async (page) => {
        try {
            const response = await getBuyersOfProduct({ ...criteria, page, limit: recordPerPage });
            if (response.data.message) {
                setMessage(response.data.message);
                setBuyers([]);
                setTotalBuyers(0);
                setTotalPages(0);
            } else {
                setMessage('');
                setBuyers(response.data);
                setTotalBuyers(response.data.length);
                setTotalPages(Math.ceil(response.data.length / recordPerPage));
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Failed to fetch buyers', error);
        }
    };

    const handlePageChange = (page) => {
        fetchBuyers(page);
    };

    return (
        <div className="container-fluid buyers-container">
            <h3>Buyers Of Product</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product:</label>
                    <select
                        name="product_id"
                        value={criteria.product_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Product</option>
                        {Object.entries(products).map(([id, product]) => (
                            <option key={id} value={id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Start Date (optional):</label>
                    <input
                        type="date"
                        name="start_date"
                        value={criteria.start_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>End Date (optional):</label>
                    <input
                        type="date"
                        name="end_date"
                        value={criteria.end_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Outlet (optional):</label>
                    <select
                        name="outlet_id"
                        value={criteria.outlet_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Outlet</option>
                        {Object.entries(outlets).map(([id, outlet]) => (
                            <option key={id} value={id}>
                                {outlet.name}
                            </option>
                        ))}
                    </select>
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
            <h4 className="mt-4">Total Buyers: {totalBuyers}</h4>
            {message && <div className="alert alert-info mt-4">{message}</div>}
            {buyers.length > 0 && !message && (
                <>
                    <Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>Buyer Name</th>
                            <th>Date</th>
                            <th>Outlet</th>
                            <th>Total Quantity</th>
                            <th>Total Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {buyers.map(buyer => (
                            <tr key={buyer.buyer_id}>
                                <td>{buyer.buyer_name}</td>
                                <td>{buyer.date}</td>
                                <td>{buyer.outlet_name}</td>
                                <td>{buyer.total_quantity}</td>
                                <td>{buyer.total_value}</td>
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

export default BuyersOfProduct;
