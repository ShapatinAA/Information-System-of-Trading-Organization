import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Pagination } from 'react-bootstrap';
import { getSuppliersByCriteria, getProducts } from '../../services/api';
import './SuppliersByCriteria.css';

const SuppliersByCriteria = () => {
    const [criteria, setCriteria] = useState({
        product_id: '',
        min_volume: '',
        start_date: '',
        end_date: ''
    });
    const [products, setProducts] = useState({});
    const [suppliers, setSuppliers] = useState([]);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [recordPerPage] = useState(5);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}));
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchSuppliers(currentPage);
    };

    const fetchSuppliers = async (page) => {
        try {
            const response = await getSuppliersByCriteria({ ...criteria, page, limit: recordPerPage });
            setSuppliers(response.data.suppliers);
            setTotalSuppliers(response.data.total_suppliers);
            setTotalPages(Math.ceil(response.data.total_suppliers / recordPerPage));
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to fetch suppliers', error);
        }
    };

    const handlePageChange = (page) => {
        fetchSuppliers(page);
    };

    return (
        <div className="container-fluid suppliers-container">
            <h3>Suppliers By Criteria</h3>
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
                    <label>Minimum Volume (optional):</label>
                    <input
                        type="number"
                        name="min_volume"
                        value={criteria.min_volume}
                        onChange={handleChange}
                        className="form-control"
                    />
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
            <h4 className="mt-4">Total Suppliers: {totalSuppliers}</h4>
            {suppliers.length > 0 && (
                <>
                    <Table striped bordered hover variant="dark" className="mt-2">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                        </tr>
                        </thead>
                        <tbody>
                        {suppliers.map(supplier => (
                            <tr key={supplier.id}>
                                <td>{supplier.id}</td>
                                <td>{supplier.name}</td>
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

export default SuppliersByCriteria;
