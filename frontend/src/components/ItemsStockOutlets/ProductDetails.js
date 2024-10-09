import React, { useState } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { getProductDetails } from '../../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
    const [criteria, setCriteria] = useState({
        product_id: '',
        outlet_id: '',
        type_id: ''
    });
    const [details, setDetails] = useState([]);

    const handleChange = (e) => {
        setCriteria({ ...criteria, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getProductDetails(criteria);
            setDetails(response.data);
        } catch (error) {
            console.error('Failed to fetch product details', error);
        }
    };

    return (
        <div className="container-fluid product-details-container">
            <h3>Product Details</h3>
            <Form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product ID:</label>
                    <input
                        type="text"
                        name="product_id"
                        value={criteria.product_id}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Outlet ID (optional):</label>
                    <input
                        type="text"
                        name="outlet_id"
                        value={criteria.outlet_id}
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
            {details.length > 0 ? (
                <Table striped bordered hover variant="dark" className="mt-2">
                    <thead>
                    <tr>
                        <th>Outlet Name</th>
                        <th>Outlet ID</th>
                        <th>Price</th>
                        <th>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {details.map(detail => (
                        <tr key={detail.outlet_id}>
                            <td>{detail.outlet_name}</td>
                            <td>{detail.outlet_id}</td>
                            <td>{detail.price}</td>
                            <td>{detail.quantity}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : <p>No details found for the specified criteria.</p>}
        </div>
    );
};

export default ProductDetails;
