import React, { useState, useEffect } from 'react';
import { Button, Table, Form } from 'react-bootstrap';
import { getProducts, getOutlets, getProductSales } from '../../services/api';
import './ProductSales.css';

const ProductSales = () => {
    const [criteria, setCriteria] = useState({
        product_id: '',
        start_date: '',
        end_date: '',
        outlet_id: '',
        type_id: ''
    });
    const [salesData, setSalesData] = useState([]);
    const [outlets, setOutlets] = useState([]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        fetchOutlets();
        fetchProducts();
    }, []);

    const fetchOutlets = async () => {
        try {
            const response = await getOutlets();
            setOutlets(response.data);
        } catch (error) {
            console.error('Failed to fetch outlets', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
            setFilteredProducts(response.data); // Initialize with all products
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCriteria({ ...criteria, [name]: value });

        if (name === 'outlet_id' && value) {
            const outletProducts = products.filter(product => product.outlet_id === value);
            setFilteredProducts(outletProducts);
        } else if (name === 'outlet_id' && !value) {
            setFilteredProducts(products); // Reset to all products if no outlet is selected
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await getProductSales(criteria);
            setSalesData(response.data);
        } catch (error) {
            console.error('Failed to fetch product sales', error);
        }
    };

    return (
        <div className="container-fluid">
            <h3>Product Sales Report</h3>
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
                    <label>Product:</label>
                    <select
                        name="product_id"
                        value={criteria.product_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>{product.name}</option>
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
            <Table striped bordered hover variant="dark" className="mt-2">
                <thead>
                <tr>
                    <th>Outlet Name</th>
                    <th>Total Quantity Sold</th>
                    <th>Total Revenue</th>
                </tr>
                </thead>
                <tbody>
                {salesData.map((data, index) => (
                    <tr key={index}>
                        <td>{data.outlet_name}</td>
                        <td>{data.total_quantity}</td>
                        <td>{data.total_revenue}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ProductSales;
