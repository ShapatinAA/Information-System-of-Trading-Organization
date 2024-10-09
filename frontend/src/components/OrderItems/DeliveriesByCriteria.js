import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Pagination } from 'react-bootstrap';
import { getSupplierDeliveries, getProducts, getSuppliers } from '../../services/api';
import './DeliveriesByCriteria.css';

const DeliveriesByCriteria = () => {
    const [criteria, setCriteria] = useState({
        product_id: '',
        supplier_id: '',
        start_date: '',
        end_date: ''
    });
    const [products, setProducts] = useState({});
    const [suppliers, setSuppliers] = useState({});
    const [deliveries, setDeliveries] = useState([]);
    const [totalDeliveries, setTotalDeliveries] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordPerPage] = useState(5);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [productsResponse, suppliersResponse] = await Promise.all([
                getProducts(),
                getSuppliers()
            ]);
            setProducts(productsResponse.data.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}));
            setSuppliers(suppliersResponse.data.reduce((acc, supplier) => ({ ...acc, [supplier.id]: supplier }), {}));
        } catch (error) {
            console.error('Failed to fetch initial data', error);
        }
    };

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchDeliveries(currentPage);
    };

    const fetchDeliveries = async (page) => {
        try {
            const response = await getSupplierDeliveries({ ...criteria, page, limit: recordPerPage });
            setDeliveries(response.data);
            setTotalDeliveries(response.data.length);
            setTotalPages(Math.ceil(response.data.length / recordPerPage));
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to fetch deliveries', error);
        }
    };

    const handlePageChange = (page) => {
        fetchDeliveries(page);
    };

    return (
        <div className="container-fluid deliveries-container">
            <h3>Supplier Deliveries By Criteria</h3>
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
                    <label>Supplier:</label>
                    <select
                        name="supplier_id"
                        value={criteria.supplier_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Supplier</option>
                        {Object.entries(suppliers).map(([id, supplier]) => (
                            <option key={id} value={id}>
                                {supplier.name}
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
                <Button type="submit" className="btn btn-dark mt-2">Search</Button>
            </Form>
            <h4 className="mt-4">Total Deliveries: {totalDeliveries}</h4>
            {deliveries.length > 0 && (
                <>
                    <Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>Product</th>
                            <th>Supplier</th>
                            <th>Total Quantity</th>
                            <th>Total Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        {deliveries.map(delivery => (
                            <tr key={`${delivery.product_id}-${delivery.supplier_id}`}>
                                <td>{products[delivery.product_id]?.name}</td>
                                <td>{suppliers[delivery.supplier_id]?.name}</td>
                                <td>{delivery.total_quantity}</td>
                                <td>{delivery.total_value}</td>
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

export default DeliveriesByCriteria;
